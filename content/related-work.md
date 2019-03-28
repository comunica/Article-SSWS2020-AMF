## Related Work
{:#related-work}

In this section we cover the relevant existing research relating to our work.
We start by discussing the TPF interface.
After that, we discuss different AMFs,
followed by their use in query evaluation.
Finally, we discuss the related work on using AMFs for the TPF interface.

### Triple Pattern Fragments
{:#related-work-ldf}

[Linked Data Fragments (LDF)](cite:cites ldf) are ways of publishing Linked Data
that are typically compared by comparing server and client effort.
On the one hand, LDFs may require a low server effort, at the cost of increased client-side querying effort (_e.g. data dumps_).
On the other hand, LDFs require a high server effort, at the cost of minimal client-side effort (_e.g. SPARQL endpoint_).
The [Triple Pattern Fragments (TPF) interface](cite:cites ldf) interface was introduced
as a trade-off between those extremes,
by restricting the server interface to triple pattern queries,
so that full SPARQL queries have to be evaluated client-side.

By default, this client-side algorithm is greedy,
and always chooses one pattern based on the lowest estimated number of matches,
and recursively applies its bindings to the remaining patterns.
While this achieves decent performs in some cases,
it can sometimes lead to inefficient query paths.
Combined with the fact that TPF returns it results in a paginated fashion,
the number of HTTP requests is forms the primary bottleneck during query evaluation.
Several enchancements have been proposed to the default TPF implementation
in an attempt to reduce the number of those requests,
such as new [query algorithms](cite:cites tpfoptimization, acosta_iswc_2015),
and [restricting the request patterns to intermediary bindings](cite:cites brtpf).
Each of those with their own advantages and disadcantages.

### Approximate Membership Functions

Approximate Membership Functions (AMFs) are functions that enable
fast membership tests with a certain chance on false positives.
These functions are typically much smaller than the full dataset,
which makes it a useful pre-filtering method.

Different AMF techniques lead to different false-positive probabilities and filter sizes.
Typically, larger filters will lead to lower false-positive probabilities.
As such, picking an AMF technique for a use case involves a trade-off between both.
[_Bloom filters_](cite:cites bloomfilter) and [_Golomb-coded sets_ (GCS)](cite:cites gcsfilter)
are two examples of AMF techniques.
Both approaches guarantee a 100% recall, but not a 100% precision.

A Bloom filter is essentially a bitmap that is filled with the range of a predefined number of hash functions.
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
as a way to [efficiently encode reachability information between triple pattern](cite:cites bloomreachability).
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

It has been shown that [the TPF approach produces a large number of so-called _membership_ requests](cite:cites amf2015).
These are requests for triple patterns _without variables_, i.e., for checking if a certain triple is present in a dataset.
This was illustrated with queries from the [WatDiv](cite:cites watdiv) benchmark,
consisting of several types of queries, namely linear (L), star (S), snowflake-shaped (F) and complex (C).
Of the 20 queries, two (L2, L4) required 50% membership requests,
one (F3) required 73%, and 4 (S5, F5, C1, C2) required more than 95%.
More than 1 in 3 queries are thus significantly impacted by the number of membership requests,
which indicates that optimizing membership queries can have a positive effect on query evaluation.

Following the declarative basis of TPF for including metadata into server requests to help the client improve query evalation,
an approach was introduced to [add approximate membership metadata to reduce the number of membership requests to the server](cite:cites amf2015).
The authors compared Bloom filters and GCS as AMF implementations behind this metadata.
Client-side query engines can detect this AMF metadata,
and use it test the membership of triples.
Due to the <100% precision, clients can only filter out true negatives based on AMFs,
so for testing true positives, an HTTP request will still need to be sent to the server.
The results of this work show that there is a significant decrease in the number of HTTP requests when AMFs are used,
at the cost of only a small increase in server load.
Even though the _number of HTTP requests is lower_, the _total execution time is higher_ for most queries,
because of the long server delays when generating AMFs.
In this work, we aim to solve this problem of higher execution times.
