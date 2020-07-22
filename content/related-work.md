## Related Work
{:#related-work}

In this section we cover the relevant existing research relating to our work.
We start by discussing the TPF interface.
After that, we discuss different AMFs,
followed by their use in query evaluation,
and their use for the TPF interface.

### Triple Pattern Fragments
{:#related-work-ldf}

[Linked Data Fragments (LDF)](cite:cites ldf)
is a conceptual framework to study
interfaces for publishing Linked Data,
by comparing server and client effort.
During query execution, some LDFs may require a low server effort,
at the cost of increased client-side querying effort (_e.g. data dumps_).
while others require a high server effort,
at the cost of minimal client-side effort (_e.g. SPARQL endpoint_).
The [Triple Pattern Fragments (TPF) interface](cite:cites ldf) was introduced
as a trade-off between those extremes,
by restricting the server interface to triple pattern queries,
and leaving the remainder of query evaluation to the client.
Compared to SPARQL endpoints,
TPF in general reduces the required server-side capacity and load
for query evaluation
at the expense of more bandwidth usage and slower query times.
Results show that the number of HTTP requests forms the primary bottleneck during querying.

TPF follows the REST architectural style,
and aims to be a fully self-descriptive API.
TPF achieves this by including _metadata_ and declarative _controls_ in all of its RDF responses next to the main data.
The metadata can contain anything that may be useful for clients during query execution,
such as cardinality estimates.

### Approximate Membership Functions

Approximate Membership Functions (AMFs) are probabilistic data structures
that efficiently can determine membership of a set,
at the cost of false positives.
They are typically much smaller than a full dataset,
making them a useful pre-filtering method.
When selecting among different AMF techniques,
we need to take into account
trade-offs between filter size and false-positive rate.

[_Bloom filters_](cite:cites bloomfilter) and [_Golomb-coded sets_ (GCS)](cite:cites gcsfilter)
are examples of AMF techniques.
Both approaches guarantee a 100% recall, but not a 100% precision.
A Bloom filter is essentially a bitmap filled with the range of a predefined number of hash functions.
Elements are added to the filter by applying all hash functions,
and `OR`-ing the results into the bitmap.
Afterwards, membership tests can be done by applying all hash functions again,
and performing a bit-wise `AND` to see if all results are _possibly_ present.
GCS were introduced as an improvement to Bloom filters
by using only a single hash function.
Furthermore, the range of the hash function is always a uniformly distributed list instead of a bitmap,
which allows for more [efficiency compression using geometric distributions](cite:cites geometriccoding).
Compared to Bloom filters, GCS achieve a higher compression rate, at the cost of slower decompression.

### Approximate Membership for Query Evaluation

AMFs find their use in many areas related to RDF querying,
such as join optimization and source selection.

AMFs have been proven to be a useful tool for improving the performance of _graph pattern joins_.
Bloom filters can therefore be used to
[efficiently group connected triple patterns by frequency](cite:cites bloomjoinsfrequency),
to improve the efficiency of merge joins [as a way of representing equivalent classes](cite:cites bloomjoinslarge),
and for [joining distributed and stored streams](cite:cites bloomdistributed).

Furthermore, Bloom filters are also used in the domain of federated querying to
optimize the process of _source selection_.
Concretely, [SPARQL's boolean ASK response can be enhanced with Bloom filters as a way of sharing a concise summary of the matching results](cite:cites bloomsparqlask).
This allows source selection algorithms to identify overlap between different sources,
and can either minimize the required number of requests,
or it can be used to retrieve as many results as possible.

### Approximate Membership Metadata for TPF
{:#related-work-amf}

Pure TPF query plans typically [produce a large number of _membership requests_](cite:cites amf2015),
checking whether a specific triple (without variables) is present in a dataset.
Due to the significant number of HTTP requests that these membership requests require,
these can cause unacceptably high query execution times.
The authors have shown 50% of all requests are membership requests for 1 in 3 queries,
which indicates that optimizing membership queries can have a positive effect on query evaluation.

In the spirit of LDF,
servers can combine multiple interface features
to assist supporting clients with query evaluation.
An interface feature with _approximate membership metadata_
for all variables in the requested _triple patterns_
[considerably reduced the number of membership requests to a server](cite:cites amf2015).
In order to reduce unneeded data transfer to clients that are unable to handle AMF metadata,
the actual binary AMFs are included out-of-band behind a link in the metadata.
Client-side query engines can detect this AMF metadata,
and use it to test the membership of triples.
Clients can skip many membership requests by ruling out true negatives
(because of the 100% recall of AMFs),
leaving only HTTP requests to distinguish false from true positives
(because of the <100% precision).
More details on the exact representation of this AMF metadata can be found on [https://github.com/comunica/Article-SSWS2020-AMF/wiki/AMF-metadata](https://github.com/comunica/Article-SSWS2020-AMF/wiki/AMF-metadata).

The results of this work show that there is a significant decrease in HTTP requests when AMFs are used,
at the cost of only a small increase in server load.
However,
even though the _number_ of HTTP requests was lower (reduction of 33%),
the _total execution time increased_ for most queries,
because of the long server delays when generating AMFs.
In this work, we aim to solve this problem of higher execution times.
