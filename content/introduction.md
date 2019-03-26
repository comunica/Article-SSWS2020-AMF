## Introduction
{:#introduction}

Over the recent years, various [Linked Data Fragments (LDFs)](cite:cites ldf) have been introduced
as ways to publish Linked Data on the Web.
The [Triple Pattern Fragments (TPF) interface](cite:cites ldf) interface was introduced
as a trade-off between server load and client-side querying effort.
It restricts the server interface to triple pattern queries,
so that full SPARQL queries have to be evaluated client-side.
TPF is a hypermedia interface that is self-descriptive.
This allows smart clients to detect metadata and controls,
which can be used to enhance the query evaluation process if the client understands these descriptions.
This self-descriptiveness has lead to the introduction of
[various interface features](cite:cites amf2015, tpfoptimization, vtpf).

Vander Sande et al. introduced the [Approximate Membership Filters (AMFs)](cite:cites amf2015) feature,
which adds AMFs as metadata to TPF.
Clients can detect and use these AMFs to reduce potentially high the number of membership subqueries
by pre-filtering potential results client-side, as a way of reducing the number expensive HTTP requests.
While the authors achieved their goal of reducing the number of HTTP requests,
their approach did not manage to reduce overall query evaluation times.

The goal of our work is to investigate unexplored aspects of AMF.
We do this by introducing new client-side algorithms for exploiting AMF metadata,
and by investigating different ways of exposing AMFs server-side.
Concretely, we introduce client-side algorithms that can use AMFs at more high-level _Basic Graph Patterns_ (BGPs),
instead of only for fully materialized triple patterns as was introduced by Vander Sande et al.
Furthermore, we evaluate the effects and feasibility of server-side pre-computation and caching of AMFs,
and the effects of different HTTP bandwidths, in-band AMFs, and different false-positive probabilities.

Due to the large number of combinations that are compared in our experiments,
we introduce a reusable benchmarking framework, called _Comunica Bencher_.
It builds on top of the highly modular [Comunica framework](cite:cites comunica) for Linked Data querying,
by working with fully declarative experiment descriptions that offer reproducible experimental results.
It lowers the barrier for reproducing the results of this work,
and creating new similar experiments in the future.

In the next section we cover the related work pertaining to this article.
After that, we introduce our research questions and hypotheses in [](#problem-statement).
Next, we introduce our client-side algorithms and server-side enchancements in [](#solution),
and discuss their implementation in [](#implementation).
In [](#evaluation), we introduce our experimental setup,
present our results, and test our hypotheses.
Finally, we draw conclusions in [](#conclusions).