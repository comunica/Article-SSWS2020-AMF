## Abstract
<!-- Context      -->
By publishing Linked Data through HTTP interfaces with different expressivity,
the effort of SPARQL query evaluation can be redistributed between clients and servers.
This can result in, for instance,
lower server-side CPU usage at the expense of higher bandwidth consumption.
Previous work has shown that complementing light-weight interfaces
such as Triple Pattern Fragments (TPF) with additional metadata
can positively impact the client and/or server in terms of performance.
<!-- Need         -->
Specifically, Approximate Membership Filters (AMFs)—filters that are small
and probabilistic— in the context of TPF were shown to reduce the number of HTTP requests,
at the expense of increasing query execution times.
<!-- Task         -->
In order to mitigate this significant drawback,
we investigated unexplored aspects of AMFs as metadata on TPF interfaces.
<!-- Object       -->
In this article, we introduce and extensively evaluate alternative approaches
for server-side publication and client-side consumption of AMFs within TPF
to achieve faster query execution, while keeping the server cost sufficiently low.
<!-- Findings     -->
Our results show that our alternative client-side algorithm
and the proposed server configurations significantly reduce
both the number of HTTP requests and the query execution times
with only a small increase in server load,
thereby mitigating the major drawback of using AMFs within TPF.
Compared to regular TPF, average query execution is more than 2 times faster
and requires only 10% of the number of HTTP requests,
at the cost of at most a 10% increase in server load.
<!-- Conclusion   -->
Finally, we summarize our findings in a set of concrete guidelines for data publishers
on how to configure AMF metadata on their servers.
<!-- Perspectives -->

<span id="keywords" rel="schema:about"><span class="title">Keywords</span>
<a href="https://en.wikipedia.org/wiki/Linked_Data" resource="http://dbpedia.org/resource/Linked_Data">Linked Data</a>;
<a href="https://en.wikipedia.org/wiki/Resource_Description_Framework" resource="http://dbpedia.org/resource/Resource_Description_Framework">RDF</a>;
<a href="https://en.wikipedia.org/wiki/SPARQL" resource="http://dbpedia.org/resource/SPARQL">SPARQL</a>;
<a href="https://linkeddatafragments.org/concept/" resource="https://linkeddatafragments.org/concept/">Triple Pattern Fragments</a>;
<a href="https://en.wikipedia.org/wiki/Query" resource="http://dbpedia.org/resource/Query">Querying</a>
</span>
