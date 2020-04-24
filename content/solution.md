## Client-side AMF Algorithms
{:#solution}

In this section, we start by illustrating how AMFs can be used during SPARQL query execution over TPF interfaces
following the approach by Vander Sande et al., and we show where it lacks.
Following that, we discuss the original client-side triple-based AMF algorithm in more detail,
followed by an introduction of our new client-side BGP-based AMF algorithm.
Finally, we introduce a heuristic that determines whether or not the BGP-based algorithm is beneficial to use.

### AMFs during SPARQL query execution

In this section, we explain how AMFs can be effective
during client-side SPARQL query execution against a TPF interface,
following the example from [Vander Sande et al](cite:cites amf2015).

<figure id="query-example-triple" class="listing">
````/code/query-example-triple.txt````
<figcaption markdown="block">
SPARQL query that finds all artists born in cities with the name "York".
</figcaption>
</figure>

Using the [default TPF algorithm](cite:cites ldf), the query from [](#query-example-triple)
will be executed by recursively identifying the triple pattern with the lowest estimated cardinality,
and applying its bindings to the remaining triple patterns.
In this case, it will start by fetching the cardinalities of the four patterns,
which are exposed by the TPF server.
In this case, these are `{(tp1, 96300), (tp2, 625811), (tp3, 2)}`.
Since `tp3` has the lowest cardinality estimate, its 2 bindings are applied to the remaining triple patterns,
and the resulting queries are handled recursively.
For example, for `?p = dbr:York` the resulting query can be found in [](#query-example-triple-2).

<figure id="query-example-triple-2" class="listing">
````/code/query-example-triple-2.txt````
<figcaption markdown="block">
The SPARQL query from [](#query-example-triple) instantiated with `?p = dbr:York`.
</figcaption>
</figure>

The same process will repeat for each of these queries.
For example, for the query in [](#query-example-triple-2),
we may get `{(tp'1, 96300), (tp'2, 207)}`,
so we continue with `tp'2`.
For example, for the first binding of `?p`, we may find `dbp:Adam_Thomas`,
which results in the query with the single fully-materialized triple pattern `dbp:Adam_Thomas a dbo:Artist`.
Each of these 207 queries are so-called _membership queries_,
as they check the presence of this triple in the dataset.
Since TPF works over HTTP, this large number of membership queries requires an equal number of HTTP requests,
which forms the main bottleneck of the execution process.

The way Vander Sande et al. solve this problem,
is by exposing AMFs for each of these triple patterns for which membership queries will be tested,
such as `?p a dbo:Artist`.
This is done by including an AMF—such as a Bloom filter—in the metadata of the TPF response for `?p a dbo:Artist`.
Before sending the 207 membership queries as HTTP requests,
each binding for `?p` will be first run through the AMF.
If it produces a true negative, then the HTTP request will _not_ be executed,
otherwise an HTTP request is required to check if it is a true or false positive.
The lower the error rate of the Bloom filter, the more true negatives can be filtered out this way.
Since false negatives are not possible, and positives still require an HTTP request, query result correctness is not affected.

<span class="comment" data-author="RV">Perhaps the paragraph below should be its own section after 4.2?</span>
<span class="comment" data-author="RV">And perhaps the remaining 4.1 and 4.2 can then be joined together, so we have clear past and new?</span>

Unfortunately, the algorithm by Vander Sande et al.
does not fully exploit the potential of AMFs during query execution over TPF interfaces,
as it only considers fully materialized triples,
and does not consider earlier filtering higher up in the query plan.
For example, let us consider the query from [](#query-example-bgp).

<figure id="query-example-bgp" class="listing">
````/code/query-example-bgp.txt````
<figcaption markdown="block">
SPARQL query that finds the occupation of all people born in York,
together with the motto of their alma mater.
</figcaption>
</figure>

For this query, the cardinality estimates are `{(tp1, 121707), (tp2, 41172), (tp3, 236), (tp4, 330413)}`.
Since `tp3` has the lowest cardinality,
its 236 bindings are applied to the remaining patterns.
For example, for `?p = dbr:Peter_John_Allan` the resulting query can be found in [](#query-example-bgp-2).

<figure id="query-example-bgp-2" class="listing">
````/code/query-example-bgp-2.txt````
<figcaption markdown="block">
The SPARQL query from [](#query-example-bgp) instantiated with `?p = dbr:Peter_John_Allan`.
</figcaption>
</figure>

Of these 236 queries, only 18 will actually find a result,
since most people do not have values for `dbo:almaMater` and `dbo:occupation`.
And if people have a value for these two patterns, the number of results is typically not more than one.
These two patterns resemble membership queries, but with non-fully-materialized triple patterns.
As such, these are not considered by the algorithm from Vander Sande et al.

One of the goals of this work is to introduce an extension to this algorithm
so that these cases are also considered by making use of AMFs.
Concretely, before sending the 236 sub-queries,
we propose to make use of the AMFs from `tp1` and `tp4`,
and filter out each `?p` binding that results in a true negative.
Since these 236 queries would normally result in even more recursive sub-queries and HTTP requests,
the impact of filtering at this higher level in the query plan
can become very significant in some cases.
As such, we propose to make use of AMFs at a higher level in the query plan
in the scope of the whole BGP,
instead of just for low-level triples.

### Triple-based AMF Algorithm

[Vander Sande et al.](cite:cites amf2015) introduced an algorithm
that acts as a cheap pre-processing step for _testing the membership of triples_.
This algorithm was used in combination with the streaming [greedy client-side TPF algorithm](cite:cites ldf) for evaluating SPARQL queries.
[](#amf-triple-pseudo) depicts this algorithm in pseudo-code.

Concretely, every triple pattern that has all of its variables resolved to constants
is run through this function right before more a expensive HTTP request would be performed.
This function takes a triple and a query context containing the AMFs
that were detected during the last TPF response for that pattern.
It will test the AMFs for all triple components, and from the moment that a true negative is found, false will be returned.
Once all checks pass, the original HTTP-based membership logic will be invoked.

Performance-wise, the overhead of this algorithm is negligible,
since for each membership query triple, just three AMF tests have to be done.
For example, for Bloom filters this test just involves a simple hash operation and a binary or,
which adds little overhead to the query execution process,
especially considering that these will in some cases avoid much more expensive HTTP requests.

<figure id="amf-triple-pseudo" class="listing">
````/code/amf-triple-pseudo.js````
<figcaption markdown="block">
Triple-based AMF algorithm by [Vander Sande et al.](cite:cites amf2015)
as a pre-filtering step for testing the membership of triples.
</figcaption>
</figure>

### BGP-based AMF Algorithm

Following the idea of the _triple-based_ algorithm,
we introduce an extension that applies this concept for _BGPs_.
This makes it possible to use AMFs not only for testing the membership of triples,
but also for using AMFs to test partially bound triple patterns that may still have variables.
In theory, this should filter (true negative) bindings earlier in the query evaluation process.

[](#amf-bgp-pseudo) shows this algorithm in pseudo-code.
Just like the triple-based algorithm, it acts as a pre-processing step when BGPs are being processed.
It takes a list of triple patterns as input, and query context containing a list of corresponding AMFs
that were detected during the last TPF responses for each respective pattern.
The algorithm iterates over each pattern,
and for each triple component that is not a variable, it will run it through its AMF.
Once a true negative is found, it will immediately return an empty stream to indicate that this BGP definitely contains no results.
If all checks on the other hand pass, the original BGP logic will be invoked,
which will down the line invoke more expensive HTTP requests.

Performance-wise, the overhead of this algorithm is also negligible.
The complexity of this algorithm is `O(n)`, with `n` the number of triple patterns.
Like before, since the AMF tests are inexpensive,
the computational impact of this algorithm is very low.

<figure id="amf-bgp-pseudo" class="listing">
````/code/amf-bgp-pseudo.js````
<figcaption markdown="block">
BGP-based AMF algorithm as a pre-filtering step for BGP evaluation.
</figcaption>
</figure>

### Heuristic for Enabling the BGP Algorithm

While our BGP-based algorithm may filter out true negative bindings sooner than the the triple-based algorithm,
it may lead to larger AMFs being downloaded, possibly incurring a larger HTTP overhead.
In some cases, this cost may become too high if the number of bindings that needs to be tested is low,
e.g. downloading an AMF of 10MB would be too costly when only a single binding needs to be tested.
To cope with these cases, we introduce a heuristic in [](#amf-bgp-heuristic-pseudo),
that will estimate whether or not the BGP-based algorithm will be cheaper in terms of HTTP overhead
compared to just executing the HTTP membership requests directly.
Concretely, the heuristic checks if the size of an AMF is lower than the size of downloading TPF responses.
This heuristic has been designed for fast calculation,
with exactness as a lower priority.
Based on measurements, we set `AMF_TRIPLE_SIZE` to 2 bytes,
and `TPF_BINDING_SIZE` to 1000 bytes by default.
In [](#evaluation), we will evaluate the effects for different `TPF_BINDING_SIZE` values.
In future work, more exact heuristics should be investigated
that take perform live profiling of HTTP requests and delays to avoid the need of these constants.
<figure id="amf-bgp-heuristic-pseudo" class="listing">
````/code/amf-bgp-heuristic-pseudo.js````
<figcaption markdown="block">
Heuristic for checking if the BGP-based AMF algorithm should be executed,
where `bindingsCount` is the number of intermediary bindings for the current BGP,
and `triplePatternsCardinality` is an array of cardinality estimates for each triple pattern in the BGP.
`AMF_TRIPLE_SIZE` is a parameter indicating the number of bytes required to represent a triple inside an AMF,
and `TPF_BINDING_SIZE` is the size in bytes of a single TPF response.
</figcaption>
</figure>
