## Related Work
{:#related-work}

In this section we cover the relevant existing research relating to our work.
The three main parts include Linked Data Fragments and specifically Triple Pattern Fragments,
which this work is an extension of,
Approximate Membership Metadata,
which is the core part of our extension,
and Comunica,
which is the framework we made our extension in.

### Linked Data Fragments
{:#related-work-ldf}

As mentioned before, there exist many possible ways to publish linked data.
All of these interfaces can be described in terms of [Linked Data Fragments (LDF)](cite:cites ldf).
LDF provides a way to differentiate the different interfaces.

The same paper also introduced a new interface, being Triple Pattern Fragments (TPF).
The idea was to provide an alternative in the middle between data dumps (high client load, not expressive) 
and SPARQL endpoints (high server load, extremely expressive)
by allowing users to only query the server with a single triple pattern at a time,
instead of full SPARQL queries,
thus forcing clients to perform the pattern joins client-side.

For this, the default implementation makes use of a greedy algorithm,
always choosing one pattern based on local optima
and recursively applying its resulting bindings to the remaining patterns.
This unfortunately has the side effect of sometimes producing quite inefficient query paths.
Combined with the fact that TPF returns it results in a paginated fashion,
this causes the biggest bottleneck for TPF to be the number of HTTP requests required to solve queries.
Several additions have already been made to the default TPF implementation
in an attempt to reduce the number of those requests,
such as new [query algorithms](cite: cites tpfoptimization, acosta_iswc_2015),
and [restricting the request patterns](cite: brtpf).
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
This metadata describes _Approximate Membership Functions_ (AMF),
which are functions that enable fast membership tests with a certain chance on false positives.
The authors compared two AMF implementations,
namely [_Bloom filters_](cite:cites bloomfilter) and [_Golomb-coded sets_ (GCS)](cite:cites gcsfilter).
Both approaches guarantee a 100% recall, but not a 100% precision.
There is a trade-off between the size of the function, and its precision.
Client-side query engines can detect this AMF metadata,
and use it test the membership of triples.
Due to the <100% precision, clients can only filter out true negatives based on AMFs,
so for testing true positives, an HTTP request will still need to be sent to the server.
The results of this work show that there is a significant decrease in the number of HTTP requests when AMFs are used,
at the cost of only a small increase in server load.
Even though the _number of HTTP requests is lower_, the _total execution time is higher_ for most queries,
because of the long server delays when generating AMFs.

Briefly compare Bloom and GCS?
{:.todo}

### Comunica
{:#related-work-comunica}

[Comunica](cite:cites comunica) is a meta query engine, designed to ease the querying of heterogeneous interfaces
with multiple possible local query solutions.
Its modular architecture allows developers to easily add or remove features.
This was quite useful for us in this work when running evaluations
as it allowed us to test out our additions compared to the original
without actually needing multiple implementations.

There already are many existing modules for Comunica.
The initial components were designed so that it could be a replacement for the previous existing TPF client.
This has the additional benefit of providing a universal way to add extension to the TPF client,
instead of having them spread out over multiple branches and incompatible repositories,
as is currently the case.

Comunica uses semantic configuration files to define which modules are included in a single instance.
It then uses [Components.js](cite:cites componentsjs), a semantic dependency injection framework,
to link the different independent modules together.
These separate configuration files can then later on be reused to reproduce our evaluation results,
our build further on them.


