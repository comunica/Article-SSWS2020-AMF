## Related Work
{:#related-work}

In this section we cover the relevant existing research relating to our work.
Concretely, we discuss the Triple Pattern Fragments interface,
the Approximate Membership Metadata feature for TPF,
and Comunica, the meta-query engine in which we implement and evaluate our approach.

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
such as new [query algorithms](cite: cites tpfoptimization, acosta_iswc_2015),
and [restricting the request patterns to intermediary bindings](cite: brtpf).
Each of those with their own advantages and disadcantages.

### Approximate Membership Metadata
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
This metadata describes _Approximate Membership Functions_ (AMFs),
which are functions that enable fast membership tests with a certain chance on false positives.
The authors compared two AMF implementations,
namely [_Bloom filters_](cite:cites bloomfilter) and [_Golomb-coded sets_ (GCS)](cite:cites gcsfilter).
Both approaches guarantee a 100% recall, but not a 100% precision.
There is a trade-off between the size of the function, and its precision.
GCS were introduced as an improvement to Bloom filters and achieves a higher compression rate, at the cost of slower decompression.
Client-side query engines can detect this AMF metadata,
and use it test the membership of triples.
Due to the <100% precision, clients can only filter out true negatives based on AMFs,
so for testing true positives, an HTTP request will still need to be sent to the server.
The results of this work show that there is a significant decrease in the number of HTTP requests when AMFs are used,
at the cost of only a small increase in server load.
Even though the _number of HTTP requests is lower_, the _total execution time is higher_ for most queries,
because of the long server delays when generating AMFs.
In this work, we aim to solve this problem of higher execution times.

### Comunica
{:#related-work-comunica}

[Comunica](cite:cites comunica) is a highly modular _meta query engine_
that was introduced to make it easier to compare different
techniques and algorithms for querying Linked Data.
Comunica already supports querying over TPF interfaces out-of-the-box,
which is why we make use of this framework for implementing our client-side AMF-based algorithms.

Comunica uses semantic configuration files to define which modules are included in a single instance.
It then uses [Components.js](cite:cites componentsjs), a semantic dependency injection framework,
to link the different independent modules together.
We make use of such configuration files to declaratively define our Comunica engine with AMF support,
so that experiments can easily be executed based on them.
