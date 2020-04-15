## Client-side AMF Algorithms
{:#solution}

In this section, we discuss the original client-side triple-based AMF algorithm,
followed by an introduction of our new client-side BGP-based AMF algorithm.
Finally, we introduce a heuristic that determines whether or not the BGP-based algorithm is beneficial to use.

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
`AMF_TRIPLE_SIZE` is a parameter indicating the amount of bytes required to represent a triple inside an AMF,
and `TPF_BINDING_SIZE` is the size in bytes of a single TPF response.
</figcaption>
</figure>
