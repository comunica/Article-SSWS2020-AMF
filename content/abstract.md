## Abstract
<!-- Context      -->
Various Linked Data Fragments (LDF) exist for exposing Linked Data on the Web.
The Triple Pattern Fragments (TPF) interface is a type of LDF that significantly lowers server-cost
by moving a large portion of the query effort client-side.
<!-- Need         -->
In previous work, Approximate Membership Functions (AMF) were added to TPF as metadata,
with the purpose of reducing the number of membership subqueries by pre-filtering potential results client-side.
Even though this lead to a reduction of HTTP requests,
the need for lower query execution times has not been met.
<!-- Task         -->
In order to effectively reduce query execution times,
we investigate several unexplored aspects regarding AMF metadata on TPF interfaces.
<!-- Object       -->
In this article, we introduce and extensively evaluate alternative approaches
for exposing (server-side) and consuming (client-side) AMF metadata
to reach lower query execution times while keeping server cost sufficiently low.
<!-- Findings     -->
Our results show that our alternative client-side algorithms significantly reduce
the number of HTTP requests and query execution times
without significantly increasing server load.
Furthermore, we conclude that server-side caching and (partial) AMF pre-computation is essential,
and offer guidelines on how AMF metadata should be configured on the server.
<!-- Conclusion   -->
Our work shows that TPF in combination with AMF metadata is feasible for data publishers,
and has significant benefits for client-side query engines.
<!-- Perspectives -->
