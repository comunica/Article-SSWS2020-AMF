## Introduction
{:#introduction}

Over the recent years, various [Linked Data Fragments (LDFs)](cite:cites ldf) have been introduced
as ways to publish Linked Data on the Web.
The [Triple Pattern Fragments (TPF) interface](cite:cites ldf) interface was introduced
as a trade-off between server load and client-side querying effort.
The server interface is restricted to triple pattern queries,
so that full SPARQL queries have to be evaluated client-side.
TPF is a hypermedia interface that is self-descriptive.

MVS: briefly explain what self-descriptive means
{:.todo}

This enables smart clients that understand these descriptions, to detect metadata and controls,
which can be used to enhance the query evaluation process.

MVS: I think the next sentence could be put differently. allowed the introduction?
{:.todo}

This self-descriptiveness has lead to the introduction of
[various interface features](cite:cites amf2015, tpfoptimization, vtpf).

One of these added features
was [Approximate Membership Filters (AMFs)](cite:cites amf2015) metadata.
Once detected, clients can use these AMFs to reduce a potentially high 
number of expensive HTTP requests by pre-filtering intermediate results client-side that lead to membership subqueries.

MVS: briefly explain what membership subqueries are
{:.todo}

While the authors achieved a reduction in HTTP requests,
their approach did not reduce overall query evaluation times.

The goal of this work is to investigate unexplored aspects of AMF.
Therefore, we extend the client-side algorithm from [](cite:cites amf2015) to also exploit AMF metadata at the more high-level _Basic Graph Patterns_ (BGPs)
in addition to only fully materialized triple patterns.
Furthermore, we evaluate the effects and feasibility of server-side pre-computation and caching of AMFs,
the effects of different HTTP bandwidths, out-of-band delivery of AMFs, and different false-positive probabilities.

Due to the large number of combinations that are compared in our experiments,
we introduce a reusable benchmarking framework, called _Comunica Bencher_.
It ensures complete reproducible experimental results by
having declarative experiment descriptions build on top of the highly modular [Comunica Linked Data querying framework](cite:cites comunica).
This lowers the barrier for reproducing the experiments of this work,
and creating similar ones in the future.

In the next section we cover the related work pertaining to this article.
After that, we introduce our research questions and hypotheses in [](#problem-statement).
Next, we introduce our client-side algorithms and server-side enchancements in [](#solution),
and discuss their implementation in [](#implementation).
In [](#evaluation), we introduce our experimental setup,
present our results, and test our hypotheses.
Finally, we draw conclusions in [](#conclusions).