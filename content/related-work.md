## Related Work
{:#related-work}

In this section we cover the relevant existing research relating to our work.
We start by discussing the TPF interface.
After that, we discuss different AMFs,
followed by their use in query evaluation.
Finally, we discuss the related work on using AMFs for the TPF interface.

### Triple Pattern Fragments
{:#related-work-ldf}

[Linked Data Fragments (LDF)](cite:cites ldf)
is a conceptual framework to study
interfaces for publishing Linked Data,
typically by comparing server and client effort.
Some LDFs may require a low server effort,
at the cost of increased client-side querying effort (_e.g. data dumps_).
while others require a high server effort,
at the cost of minimal client-side effort (_e.g. SPARQL endpoint_).
The [Triple Pattern Fragments (TPF) interface](cite:cites ldf) interface was introduced
as a trade-off between those extremes,
by restricting the server interface to triple pattern queries,
and leaving the remainder of SPARQL query evaluation to the client.

By default, this client-side algorithm is greedy,
<span class="remark" data-author="RV">there is no real default (in the scientific sense);
perhaps <q>a straightforward algorithm</q></span>
and always chooses one pattern based on the lowest estimated number of matches,
and recursively applies its bindings to the remaining patterns.
While this achieves decent performance in some cases,
it can sometimes lead to inefficient query plans.
Combined with the fact that TPF returns it results in a paginated fashion,
the number of HTTP requests is forms the primary bottleneck during query evaluation.
Several enhancements have been proposed to the default TPF implementation
in an attempt to reduce the number of those requests,
such as different [query algorithms](cite:cites tpfoptimization, acosta_iswc_2015),
and [restricting the request patterns to intermediary bindings](cite:cites brtpf),
each of those with their own advantages and disadvantages.

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
such as storage, join optimization, source selection.

In the area of databases for _RDF storage_,
Bloom filters can be used to [reduce the number of expensive I/O operations](cite:cites bloomIO)
as a pre-filtering step during triple pattern query evaluation.
There is also an approach that uses Bloom filters internally
as a way to [efficiently encode reachability information between triple patterns](cite:cites bloomreachability).
More recently, a combination of multiple Bloom filters were also being used
as a way to [compactly store a vector-based filtering index](cite:cites bloomsfilterindex).

Next to that, AMFs are also a useful tool for improving the performance of _graph pattern joins_.
Bloom filters can therefore be used to
[efficiently group connected triple patterns by frequency](cite:cites bloomjoinsfrequency),
to improve the efficiency of merge joins [as a way of representing equivalent classes](cite:cites bloomjoinslarge),
and even for [joining distributed and stored streams](cite:cites bloomdistributed).

Furthermore, Bloom filters are also used in the domain of federated querying to
optimize the process of _source selection_.
Concretely, [SPARQL's boolean ASK response can be enhanced with Bloom filters as a way of sharing a concise summary of the matching results](cite:cites bloomsparqlask).
This allows source selection algorithms to identify overlap between different sources,
and can either minimize the required number of requests,
or it can be used to retrieve as many results as possible.

### Approximate Membership Metadata for TPF
{:#related-work-amf}

Pure TPF query plans typically [produce a large number of so-called _membership requests_](cite:cites amf2015),
checking whether a specific triple (without variables) is present in a dataset.
This was illustrated with queries from the [WatDiv](cite:cites watdiv) benchmark,
consisting of several types of queries, namely linear (L), star (S), snowflake-shaped (F) and complex (C).
Of the 20 queries, two (L2, L4) required 50% membership requests,
one (F3) required 73%, and 4 (S5, F5, C1, C2) required more than 95%.
More than 1 in 3 queries are thus significantly impacted by the number of membership requests,
which indicates that optimizing membership queries can have a positive effect on query evaluation.

In the spirit of LDF,
servers can combine multiple interface features
to assist supporting clients with query evaluation.
An interface feature with approximate membership metadata
for all variables in the requested triple patterns
[considerably reduced the number of membership requests to a server](cite:cites amf2015).
Client-side query engines can detect this AMF metadata,
and use it test the membership of triples.
In order to reduce unneeded data transfer to clients that are unable to handle AMF metadata,
the actual binary AMFs are included out-of-band behind a link in the metadata.
Clients can skip many membership requests by ruling out true negatives
(because of the 100% recall of AMFs),
leaving only HTTP requests to distinguish false from true positives
(because of the <100% precision).
The results of this work show that there is a significant decrease in the number of HTTP requests when AMFs are used,
at the cost of only a small increase in server load.
However,
even though the _number_ of HTTP requests was lower,
the _total execution time increased_ for most queries,
because of the long server delays when generating AMFs.
In this work, we aim to solve this problem of higher execution times.
