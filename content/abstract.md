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
Specifically, Approximate Membership Filters (AMFs)
—filters that are small and probabililistic—
were shown to reduce the number of HTTP requests,
at the expense of increasing query execution times.
<!-- Task         -->
In order to mitigate this drawback,
we investigated unexplored aspects of AMFs as metadata on TPF interfaces.
<!-- Object       -->
In this article, we introduce and extensively evaluate alternative approaches
for exposing (server-side) and consuming (client-side) AMFs
to reach lower query execution times, while keeping the server cost sufficiently low.
<!-- Findings     -->
Our results show that our alternative client-side algorithm significantly reduces
both the number of HTTP requests and the query execution times
without significantly increasing server load.
<!-- Conclusion   -->
We conclude that server-side caching and (partial) AMF pre-computation is essential,
and translate these findings into concrete guidelines for data publishers
to configure AMF metadata on their servers.
<!-- Perspectives -->
