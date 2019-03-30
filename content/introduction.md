## Introduction
{:#introduction}

Over the recent years, different kinds of [Linked Data Fragments (LDF) interfaces](cite:cites ldf) have been introduced
as ways to publish Linked Data on the Web.
The [Triple Pattern Fragments (TPF) interface](cite:cites ldf) interface was introduced
as a trade-off between server load and client-side querying effort.
The server interface is restricted to triple-pattern queries,
so that all remaining elements of SPARQL queries have to be evaluated client-side.
TPF is a hypermedia interface that is self-descriptive.
<span class="comment" data-author="MVS">briefly explain what self-descriptive means</span>
This enables smart clients that understand these descriptions to detect metadata and controls,
which can be used to enhance the query evaluation process.
<span class="comment" data-author="RV">More important is that you explain that TPF is a composable building block. So this article is not introducing yet another interface, but rather an independent block that can be combined with TPF. Cite [this](cite:cites verborgh_ic_2018) if meaningful and space.</span>
<span class="comment" data-author="MVS">I think the next sentence could be put differently. allowed the introduction?</span>
This self-descriptiveness has lead to the introduction of
[various independent interface features](cite:cites amf2015, tpfoptimization, vtpf)
that can be combined with TPF.
<span class="comment" data-author="RV">Rather, the composability. Self-description is what makes it work seamlessly.</span>

One such feature is [Approximate Membership Filters (AMFs)](cite:cites amf2015) metadata.
When clients detect AMFs in the response,
<span class="comment" data-author="RV">the aforementioned is enough for me as far as self-descriptiveness goes</span>
they can use them to reduce a potentially high 
number of expensive HTTP requests by pre-filtering intermediate results client-side that lead to membership subqueries.
<span class="comment" data-author="MVS">briefly explain what membership subqueries are</span>
<span class="comment" data-author="RV">alternatively, do not explain but stay on an even higher level (and possibly point forward to next section <q>as detailed in …</q>)</span>
While the authors achieved a reduction in HTTP requests,
their approach did not reduce overall query evaluation times.

The goal of this work is to investigate unexplored aspects of AMF.
<span class="comment" data-author="RV">no, the goal is to improve on the above? or, more widely, to gain a better understanding of how AMF and TPF interact?</span>
Therefore, we extend the client-side algorithm from [](cite:cites amf2015) to also exploit AMF metadata at the more high-level _Basic Graph Patterns_ (BGPs)
in addition to only fully materialized triple patterns.
Furthermore, we evaluate the effects and feasibility of server-side pre-computation and caching of AMFs,
the effects of different HTTP bandwidths, out-of-band delivery of AMFs, and different false-positive probabilities.
<span class="comment" data-author="RV">All correct, yet no one but us will understand. It's exact, but not useful if the reader cannot get this until the next section.</span>

Because of the large number of combinations that are compared in our experiments,
we introduce a reusable benchmarking framework, called _Comunica Bencher_.
It ensures complete reproducible experimental results by
having declarative experiment descriptions build on top of the modular [Comunica Linked Data querying framework](cite:cites comunica).
This lowers the barrier for reproducing the experiments of this work,
and creating similar ones in the future.

In the next section we cover the related work pertaining to this article.
After that, we introduce our research questions and hypotheses in [](#problem-statement).
Next, we introduce our client-side algorithms and server-side enchancements in [](#solution),
and discuss their implementation in [](#implementation).
In [](#evaluation), we introduce our experimental setup,
present our results, and test our hypotheses.
Finally, we draw conclusions in [](#conclusions).
