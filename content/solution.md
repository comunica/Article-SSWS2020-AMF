## Client-side AMF Algorithms
{:#solution}

In this section, we discuss the existing and new client-side algorithms that use AMF metadata.
For the sake of completeness, we first discuss the original triple-based AMF algorithm.
After that, we introduce our new BGP-based AMF algorithm.

### Triple-based AMF Algorithm

[Vander Sande et al.](cite:cites amf2015) introduced an algorithm
that acts as a cheap pre-processing step for testing the membership of triples.
This algorithm was used in combination with the streaming [client-side TPF algorithm](cite:cites ldf) for evaluating SPARQL queries.

This algorithm can be seen in pseudo-code in [](#amf-triple-pseudo).
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

Following the idea of the triple-based algorithm,
we introduce an extension that applies this concept for BGPs.
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
which will down the line invoke expensive HTTP requests.

<figure id="amf-bgp-pseudo" class="listing">
````/code/amf-bgp-pseudo.js````
<figcaption markdown="block">
BGP-based AMF algorithm as a pre-filtering step for BGP evaluation.
</figcaption>
</figure>
