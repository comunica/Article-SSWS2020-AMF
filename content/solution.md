## New AMF approaches
{:#solution}

The AMF approach requires changes on both client-side as server-side,
and our contributions adapt parts on both sides.
For both sides, we discuss the pre-existing approaches
and our contributions hereafter.

### Client-side query algorithm

For the sake of completeness, we first discuss the original triple-based AMF algorithm.
After that, we introduce our new BGP-based AMF algorithm.
Finally, we introduce a heuristic that determines whether or not the BGP-based algorithm is beneficial to use.

#### Triple-based AMF algorithm

[Vander Sande et al.](cite:cites amf2015) introduced an algorithm
that acts as a cheap pre-processing step for testing the membership of triples.
This algorithm was used in combination with the streaming [client-side TPF algorithm](cite:cites ldf) for evaluating SPARQL queries.

This algorithm can be seen in pseudo-code in [](#amf-triple-pseudo).
Concretely, every triple pattern that has no variables anymore
is run through this function just before more expensive HTTP requests will be done,
as a way of reducing the number of needed HTTP requests.
This function takes a triple and the AMFs that were detected during the last TPF response for that pattern.
It will test the AMFs for all triple components, and from the moment that a true negative is found, false will be returned.
Once all checks pass, the original HTTP-based membership logic will be invoked.

<figure id="amf-triple-pseudo" class="listing">
````/code/amf-triple-pseudo.js````
<figcaption markdown="block">
Triple-based AMF algorithm by [Vander Sande et al.](cite:cites amf2015)
as a pre-filtering step for testing the membership of triples.
</figcaption>
</figure>

#### BGP-based AMF algorithm

Following the idea of the triple-based algorithm,
we introduce an extension that applies this concept for BGPs.
This makes it possible to use AMFs not only for testing the membership of triples,
but also for using AMFs to test partially bound triple patterns that may still have variables.
In theory, this should filter (true negative) bindings earlier in the query evaluation process.

[](#amf-bgp-pseudo) shows this algorithm in pseudo-code.
Just like the triple-based algorithm, it acts as a pre-processing step when BGPs are being processed.
It takes a list of triple patterns as input, and a list of corresponding AMFs
that were detected during the last TPF responses for each respective pattern.
The algorithm iterates over each pattern,
and for each triple component that is not a variable, it will run it through its AMF.
Once a true negative is found, it will immediately return an empty stream to indicate that this BGP definitely contains no results.
If all checks on the other hand pass, the original BGP logic will be invoked,
which will down the line invoke expensive HTTP requests.

<figure id="amf-bgp-pseudo" class="listing">
````/code/amf-bgp-pseudo.js````
<figcaption markdown="block">
BGP-based AMF algorithm as a pre-filtering step for BGP evaluation.
</figcaption>
</figure>

#### Heuristic for enabling the BGP algorithm

The advantage of our BGP-based algorithm is that it may filter out true negative bindings
much sooner in the query evaluation process compared to the triple-based algorithm.
The consequence of this is that AMFs for large patterns will have to be downloaded,
which may come at the cost of increased HTTP transfer amounts.
In some cases, this cost may become too high for the number of bindings that need to be tested.
For example, if only a single binding needs to be tested,
then downloading the AMF of a pattern with 1M triples will be significantly
more expensive than doing a single membership HTTP request.

To cope with these cases, we introduce a heuristic in [](#amf-bgp-heuristic-pseudo),
that will check whether or not the BGP-based algorithm will be cheaper in terms of HTTP overhead
compared to just executing the HTTP membership requests directly.
This heuristic has been designed for fast calculation,
with exactness as a lower priority.

The algorithm takes a number of bindings and a list estimated counts for each of the triple patterns as inputs.
It will first calculate the total size in bytes of all AMFs that would have to be downloaded,
based on a constant `AMF_TRIPLE_SIZE`, which represents the size of a triple in an AMF.
Next, the total size in bytes of all membership requests is calculated based on the constant `TPF_BINDING_SIZE`,
which represents the size of a membership request.
If the total AMF size is smaller than the total membership request size,
then the BGP-based algorithm is expected to be more effective.

Based on measurements, we set `AMF_TRIPLE_SIZE` to `2 bytes`, and `TPF_BINDING_SIZE` to `1000 bytes` by default.
In [](#evaluation), we will evaluate the effects for different values for `TPF_BINDING_SIZE`.
In future work, more exact heuristics should be investigated
that take perform live profiling of HTTP requests and delays to avoid the need of these constants.

<figure id="amf-bgp-heuristic-pseudo" class="listing">
````/code/amf-bgp-heuristic-pseudo.js````
<figcaption markdown="block">
Heuristic for checking if the BGP-based AMF algorithm should be executed.
</figcaption>
</figure>

### Server-side metadata generation

The original TPF server extension by [Vander Sande et al.](cite:cites amf2015)
allowed both Bloom filters and GCS to be created on-the-fly for any triple pattern.
These filters would be added out-of-band as metadata to TPFs.
We extended this implementation with three new features.

First, since we want to evaluate whether or not including AMF metadata in-band
can reduce the total number of HTTP requests and query execution times,
we implemented a way to emit this metadata in-band if the triple count of the given pattern is below a certain configurable threshold.
Originally, all AMF metadata would always be emitted out-of-band,
which requires an additional HTTP request for clients.
This threshold should not be set too high, as large AMFs will introduce some overhead for clients
that do not need or do not understand AMF metadata.

Secondly, in order to measure the server overhead of large AMFs,
we added a config option to dynamically enable AMFs for triple patterns
with number of matching triples below a given threshold.

Finally, we implemented a (disableable) file-based cache to avoid recomputing AMFs
to make pre-computation of AMFs possible.
