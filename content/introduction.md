## Introduction
{:#introduction}

Over the recent years, different kinds of [Linked Data Fragments (LDF) interfaces](cite:cites ldf) have been introduced
as ways to publish Linked Data on the Web,
with the [Triple Pattern Fragments (TPF) interface](cite:cites ldf)
as a trade-off between server load and client-side querying effort.
The server interface is restricted to triple-pattern queries,
so that all remaining elements of SPARQL queries have to be evaluated client-side.
Compared to SPARQL endpoints,
TPF in general reduces the required server-side capacity and load
for query evaluation
at the expense of more bandwidth usage and slower query times.

With the goal of preserving the benefits of TPF
while reducing its disadvantages,
[various research efforts examined additional interface features](cite:cites amf2015, tpfoptimization, brtpf, vtpf)
that can be used independently or in conjunction with TPF.
Through usage of [self-descriptive hypermedia](cite:cites verborgh_ic_2018) on the server,
clients can automatically detect metadata and controls
and use these additional features to enhance the query evaluation process.
One such feature is [Approximate Membership Filter (AMF)](cite:cites amf2015) metadata,
which supporting clients can use to reduce the required number
of HTTP requests,
with only a slight increase in server cost.
Unfortunately, this currently comes at the cost of increased query execution times,
because the individual HTTP requests were larger and more expensive to compute.

This work brings a deeper understanding of the appliance and benefits of AMF metadata for Linked Data interfaces.
In particular, 
we provide solutions to mitigate the excessive overhead from [Vander Sande et al.](cite:cites amf2015) and further reduce the gap in query execution time between TPF-based querying and SPARQL endpoints.
Therefore, we introduce a client-side algorithm to exploit AMF metadata
early in the query evaluation.
This approach is complimentary to the [existing algorithm](cite:cites amf2015),
but speeds up query execution.
Furthermore, we evaluate the effects and feasibility of different server-side AMF features and configurations.

Because of the large number of combinations that are compared in our experiments,
we introduce a reusable benchmarking framework, called _Comunica Bencher_.
It ensures complete reproducible experimental results by
having declarative experiment descriptions build on top of [Comunica](cite:cites comunica),
a modular Linked Data querying framework.
This facilitates the reproduction of the experiments of this work,
as well as the creation of related experiments in the future.

In the next section, we cover the related work pertaining to this article.
After that, we introduce our research questions in [](#problem-statement).
Next, we introduce our client-side algorithm in [](#solution).
In [](#evaluation), we introduce our experimental setup,
present our results, and test our hypotheses.
Finally, we draw conclusions in [](#conclusions).
