## Client-side AMF algorithms
{:#solution}

In this section, we discuss the existing and new client-side algorithms that use AMF metadata.
For the sake of completeness, we first discuss the original triple-based AMF algorithm.
After that, we introduce our new BGP-based AMF algorithm.
Finally, we introduce a heuristic that determines whether or not the BGP-based algorithm is beneficial to use.

### Triple-based AMF algorithm

[Vander Sande et al.](cite:cites amf2015) introduced an algorithm
that acts as a cheap pre-processing step for testing the membership of triples.
This algorithm was used in combination with the streaming [client-side TPF algorithm](cite:cites ldf) for evaluating SPARQL queries.

<span class="comment" data-author="RV">Up until now, I had the impression that there would be one AMF that took a triple pattern. But it's three (independent) position-based filters.</span>

This algorithm can be seen in pseudo-code in [](#amf-triple-pseudo).
Concretely, every triple pattern that has all of its variables resolved to constants
is run through this function right before more a expensive HTTP request would be performed.
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

<span class="comment" data-author="RV">suggestion: replace <code>filter</code> by <code>contains</code> and negate the condition (which seems to be missing)?</span>

<span class="comment" data-author="RV"><code>super</code> probably doesn't take an AMF, does it?</span>

### BGP-based AMF algorithm

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

<span class="comment" data-author="RV">why suddenly multiple AMFs here?</span>

<span class="comment" data-author="RV"><code>super</code> probably doesn't take an AMF, does it?</span>

### Heuristic for enabling the BGP Algorithm

While our BGP-based algorithm may filter out true negative bindings sooner than the the triple-based algorithm,
it may lead to larger AMFs being downloaded, possibly incurring a larger HTTP overhead.
In some cases, this cost may become too high if the number of bindings that needs to be tested is low.

To cope with these cases, we introduce a heuristic in [](#amf-bgp-heuristic-pseudo),
that will estimate whether or not the BGP-based algorithm will be cheaper in terms of HTTP overhead
compared to just executing the HTTP membership requests directly.
This heuristic has been designed for fast calculation,
with exactness as a lower priority.
Based on measurements, we set `AMF_TRIPLE_SIZE` to 2 bytes,
and `TPF_BINDING_SIZE` to 1000 bytes by default.
In [](#evaluation), we will evaluate the effects for different `TPF_BINDING_SIZE` values.
In future work, more exact heuristics should be investigated
that take perform live profiling of HTTP requests and delays to avoid the need of these constants.

<span class="comment" data-author="RV">more important is an intuitive idea of why/how the heuristic works</span>

<figure id="amf-bgp-heuristic-pseudo" class="listing">
````/code/amf-bgp-heuristic-pseudo.js````
<figcaption markdown="block">
Heuristic for checking if the BGP-based AMF algorithm should be executed.
</figcaption>
</figure>

<span class="comment" data-author="RV">how about <code>preferAmfForBgp</code>?</span>

<span class="comment" data-author="RV">I don't understand the inputs by their name</span>
<span class="comment" data-author="RV">how about <code>triplePatternMatchCountss</code>?</span>
