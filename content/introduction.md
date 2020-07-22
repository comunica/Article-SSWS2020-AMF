## Introduction
{:#introduction}

[SPARQL endpoints](cite:cites spec:sparqlprot),
which expose Linked Data on the Web through a query-based interface,
tend to [suffer from availability issues](cite:cites sparqlreadyforaction).
In comparison to most other HTTP servers,
SPARQL endpoints require high-end computational resources
due the high complexity of [SPARQL queries](cite:cites spec:sparqllang)
and can thus be difficult to sustain
when a number of concurrent clients request query execution.
In order to cope with this problem,
the [Linked Data Fragments (LDF) effort](cite:cites ldf)
has been initiated as a conceptual framework to investigate alternative query interfaces to publish Linked Datasets,
by redistributing the effort of query evaluation between servers and clients.

LDF interfaces allow some parts of the query to be performed on the server, and some on the client,
which leads to a redistribution of effort between server and client.
This redistribution requires queries to be decomposed into multiple smaller queries,
which typically leads to slower query execution due to the HTTP overhead of these roundtrips,
compared to fully server-side query execution.
In order to reduce this number of smaller queries,
servers could send a pre-filter to the client,
which could potentially eliminate many of these queries.
The focus of this work is investigating such pre-filters.

In recent years, different kinds of these LDF interfaces have been introduced,
such as [Triple Pattern Fragments (TPF)](cite:cites ldf),
[Bindings-Restricted Triple Pattern Fragments](cite:cites brtpf),
[SaGe](cite:cites sage),
and [Smart-KG](cite:cites smartkg).
Each of these types of interfaces introduce their own trade-offs in terms of server and client effort.
Additionally, LDF interfaces can enable feature-based extensibility,
which allows servers to optionally expose certain features as metadata through usage of [self-descriptive hypermedia](cite:cites verborgh_ic_2018),
which can then be detected automatically by supporting clients to enhance the query evaluation process.
Due to the extensibility of TPF, [several interface features have already been proposed for TPF](cite:cites amf2015, tpfoptimization, vtpf).
One such feature is [Approximate Membership Filter (AMF)](cite:cites amf2015) metadata,
which supporting clients can use to reduce the number of HTTP requests,
with only a slight increase in server cost.
Unfortunately, this currently comes at the cost of slower query execution,
because the individual HTTP requests were larger and more expensive to compute.
Since TPF is [quickly gaining adoption among publishers](cite:cites tpfusage),
we focus on improving the performance of AMF with TPF in this work.
AMF could also be useful for other types of LDF interfaces, but we consider this out of scope for this work.

Even though the work on extending TPF with AMFs showed excessive overhead,
we claim that these problems can be resolved,
and that AMFs can be used to lower overall query execution times without significantly increasing server load.
As such, the goal of our work is to investigate
what changes are required server-side and client-side
to optimize AMFs for TPF.
Concretely, we introduce six dimensions through which the AMF approach from [Vander Sande et al.](cite:cites amf2015) can be improved.
One of these dimensions involves the introduction of a new client-side algorithm to handle AMFs.
The other dimensions are related to the server-side handling of AMFs.
The effects and feasibility of each of these dimensions are evaluated and analyzed in detail.
In summary, our work brings a deeper understanding of the appliance and benefits of AMF metadata for Linked Data interfaces,
so that Linked Data publishers can expose their Linked Datasets in a more efficient manner through TPF interfaces.

In the next section, we cover the related work pertaining to this article.
After that, we introduce our research questions in [](#problem-statement).
Next, we introduce our client-side algorithm in [](#solution).
In [](#evaluation), we introduce our experimental setup,
present our results, and test our hypotheses.
Finally, we draw conclusions in [](#conclusions).
