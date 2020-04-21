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
Some LDFs may require a low server effort,
<span class="comment" data-author="RV">to do what?</span>
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

TPF follows the REST architectural style,
and aims to be a fully self-descriptive API.
TPF achieves this by including _metadata_ and _controls_ in all of its RDF responses next to the main data.
The metadata can contain anything that may be useful for clients during query execution,
such as cardinality estimates.
The controls are described in a declarative manner using the [Hydra Core vocabulary](cite:cites hydra),
and allow clients to detect how queries can be executed against the API.
In the case of TPF, these controls describe a form with _subject_, _predicate_ and _object_ parameters.

The client-side algorithm that is often used in implementations is _greedy_,
and always chooses one pattern based on the lowest estimated number of matches,
and recursively applies its bindings to the remaining patterns.
While this achieves decent performance in some cases,
it can sometimes lead to inefficient query plans.
Combined with the fact that TPF returns results paginated,
the number of HTTP requests forms the primary bottleneck during querying.
Several enhancements have been proposed to this greedy algorithm
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
This was illustrated with queries from the [WatDiv](cite:cites watdiv) benchmark,
consisting of several types of queries, namely linear (L), star (S), snowflake-shaped (F) and complex (C).
Of the 20 queries, two (L2, L4) required 50% membership requests,
one (F3) required 73%, and 4 (S5, F5, C1, C2) required more than 95%.
More than 1 in 3 queries are thus significantly impacted by the number of membership requests,
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
In order to reduce unneeded data transfer to clients that are unable to handle AMF metadata,
the actual binary AMFs are included out-of-band behind a metadata link.
Clients can skip many membership requests by ruling out true negatives
(because of the 100% recall of AMFs),
leaving only HTTP requests to distinguish false from true positives
(because of the <100% precision).

The way Vander Sande et al. make use of AMFs involves exposing an AMF, such as a Bloom filter,
for each variable triple component in a TPF response.
For example, if the query `ex:mysubject ?p ?o` is sent to a TPF server,
then the response could contain a Bloom filter for `?p` and one `?o`.
The Bloom filter for `?p` contains all predicates that have `ex:mysubject` as subject,
and the Bloom filter for `?o` similarly contains all objects that have this same subject.
Each Bloom filter is populated with RDF terms using server-defined hashing parameters,
so that the end result is a binary blob.
The server shares these parameters in the AMF metadata so that clients can apply the same hashing function
on the RDF terms they want to check membership for.
When a client receives the TPF response for `ex:mysubject ?p ?o`,
it will be able to detect and download these two Bloom filters.
If during query execution the client needs to do a membership check against this pattern,
for example for `ex:mysubject rdf:type foaf:Person`,
the client can first do a pre-filtering step by looking for `rdf:type` in the first AMF,
and `foaf:Person` in the second AMF.
If any of these checks fail, this means that this triple definitely does _not_ exist in the dataset,
and the actual membership HTTP request can be skipped.

[](#amf-metadata-outband) shows an example of what this AMF metadata can look like in a TPF response for the query `ex:mysubject ?p ?o`.
Concretely, the AMF metadata resides in the `<#metadata>` graph of the TPF HTTP response,
which can contain other non-AMF-related elements such as `void:triples`.
The available AMFs for a given response are defined via the predicate `ms:membershipFilter`,
and the triple pattern component they apply to is indicated via `ms:variable`.
As the approach from Vander Sande et al. does not include AMFs in-band,
clients must _dereference_ the IRI of the AMF to get its binary contents.
For example, the dereferenced contents of the predicate AMF from [](#amf-metadata-outband) can be seen in [](#amf-metadata-outband-link).
Next to the binary contents of the AMF in n base64-encoded form (`ms:filter`), the type of the AMF is indicated `ms:BloomFilter`,
and Bloom-filter-specific parameters are included such as `ms:hashes` and `ms:bits`.

<figure id="amf-metadata-outband" class="listing">
````/code/amf-metadata-outband.trig````
<figcaption markdown="block">
Self-descriptive AMF metadata in a TPF response for `ex:mysubject ?p ?o`,
which allows intelligent clients to detect, interpret and make use it.
</figcaption>
</figure>

<figure id="amf-metadata-outband-link" class="listing">
````/code/amf-metadata-outband-link.trig````
<figcaption markdown="block">
Out-of-band AMF details for the AMF of the predicate component in [](#amf-metadata-outband),
which exists in the document `</amf/my-dataset?query=...#predicate>` that can be followed by clients through dereferencing.
</figcaption>
</figure>


The results of this work show that there is a significant decrease in HTTP requests when AMFs are used,
at the cost of only a small increase in server load.
However,
even though the _number_ of HTTP requests was lower (reduction of 33%),
the _total execution time increased_ for most queries,
because of the long server delays when generating AMFs.
In this work, we aim to solve this problem of higher execution times.
