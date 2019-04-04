## Introduction
{:#introduction}

Over the recent years, different kinds of [Linked Data Fragments (LDF) interfaces](cite:cites ldf) have been introduced
as ways to publish Linked Data on the Web,
with the [Triple Pattern Fragments (TPF) interface](cite:cites ldf)  
as a trade-off between server load and client-side querying effort.
The server interface is restricted to triple-pattern queries,
so that all remaining elements of SPARQL queries have to be evaluated client-side.
TPF is a hypermedia interface that is _self-descriptive_,
which enables smart clients that _understand_ these descriptions to detect metadata and controls,
and can be used to enhance the query evaluation process.
This self-descriptiveness allows TPF to be [_composed_ with various _independent building blocks_](cite:cites verborgh_ic_2018)
by adding new metadata to the interface,
and allowed the introduction of a variety of [TPF features](cite:cites amf2015, tpfoptimization, vtpf).
One such feature is [Approximate Membership Filters (AMFs)](cite:cites amf2015) metadata.
Clients can detect AMFs in the response, and use it to reduce the required number
of HTTP requests at the cost of increased query execution times.

As querying with the server-friendly TPF approach
is typically much slower than with SPARQL endpoints,
there is a need to make TPF-based querying faster.
We claim that AMF offers a way to achieve this
without becoming too expensive for servers.
The goal of this work is to gain a better understanding of how AMF interfacts with TPF,
and how its previously discovered increase in query execution times can be mitigated.
Therefore, we extend the client-side algorithm from [Vander Sande et al.](cite:cites amf2015) to exploit AMF metadata
earlier during query evaluation for speeding up query execution.
Furthermore, we evaluate the effects and feasibility of different server-side AMF features and configurations.

Because of the large number of combinations that are compared in our experiments,
we introduce a reusable benchmarking framework, called _Comunica Bencher_.
It ensures complete reproducible experimental results by
having declarative experiment descriptions build on top of the modular [Comunica Linked Data querying framework](cite:cites comunica).
This lowers the barrier for reproducing the experiments of this work,
and creating similar ones in the future.

In the next section we cover the related work pertaining to this article.
After that, we introduce our research questions in [](#problem-statement).
Next, we introduce our client-side algorithms and server-side enhancements in [](#solution).
In [](#evaluation), we introduce our experimental setup,
present our results, and test our hypotheses.
Finally, we draw conclusions in [](#conclusions).
