## Related Work
{:#related-work}

use [AMF paper](http://linkeddatafragments.org/publications/iswc2015-amf.pdf) for inspiration
{:.todo}

### LDF stuff & extensions
{:#related-work-ldf}

Make sure to explain that HTTP requests are a main bottleneck (important for the next section)
{:.todo}

### Approximate Membership Metadata

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

[Comunica](cite:cites comunica) is a meta query engine, designed to ease the querying of heterogeneous interfaces
with multiple possible local query solutions.
Its modular architecture allows developers to easily add or remove features.
This was quite useful for us in this work when running evaluations
as it allowed us to test out our additions compared to the original
without actually needing multiple implementations.

Comunica uses semantic configuration files to define which modules are included in a single instance.
It then uses [Components.js](cite:cites componentsjs), a semantic dependency injection framework,
to link the different independent modules together.
These separate configuration files can then later on be reused to reproduce our evaluation results,
our build further on them.


