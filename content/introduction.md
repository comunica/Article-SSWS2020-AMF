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
has been initiated to investigate alternative query interfaces to publish Linked Datasets,
by redistributing the effort of query evaluation between servers and clients.

<span class="comment" data-author="RV">In this entire section, I wonder whether we want to go a bit more high level still. Talking about how parts of a query are performed on the server, some on the client. (So adding a high-level sentence like that to the next para.) Then making a point how people noticed that many queries ultimately decomposed to a series of yes/no questions of whether a certain fact exist. Instead of asking such questions individually, the server can send a pre-filter to the client, eliminating a lot of those questions. Cue AMF.</span>
<span class="comment" data-author="RV">By doing this, the intro (and thus the entire article) becomes instantly accessible to a wider audience.</span>

<span class="comment" data-author="RV">Perhaps a little bit about what LDF is? A conceptual framework for defining different kind of interfaces to Linked Data?</span>
In recent years, different kinds of these LDF interfaces have been introduced,
such as [Triple Pattern Fragments (TPF)](cite:cites ldf),
[Bindings-Restricted Triple Pattern Fragments](cite:cites brtpf),
[SaGe](cite:cites sage),
and [Smart-KG](cite:cites smartkg).
Each of these types of interfaces introduce their own trade-offs in terms of server and client effort.
Since TPF is [quickly gaining adoption among publishers](cite:cites tpfusage),
we focus on improving its performance in this work.
<span class="comment" data-author="RV">Actually, that might not be entirely correct. We maybe really want to spend some effort explaining how LDF interfaces can be built out of different features, which can be combined. One of these features is AMF. However, since TPF is the one gaining adoption, we will test AMF with TPF. But could as well test it with all of the others!</span>

With the goal of preserving the benefits of TPF
while reducing its disadvantages,
[various research efforts examined additional interface features](cite:cites amf2015, tpfoptimization, vtpf)
that can be used independently or in conjunction with TPF.
Through usage of [self-descriptive hypermedia](cite:cites verborgh_ic_2018) on the server,
clients can automatically detect metadata and controls
and use these additional features to enhance the query evaluation process.
<span class="comment" data-author="RV">OK, fair enough, the features are here. Then I think it's just a matter of tying the previous paragraph and this one together fully correctly.</span>
One such feature is [Approximate Membership Filter (AMF)](cite:cites amf2015) metadata,
which supporting clients can use to reduce the number of HTTP requests,
with only a slight increase in server cost.
Unfortunately, this currently comes at the cost of slower query execution,
because the individual HTTP requests were larger and more expensive to compute.

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

Because of the large number of combinations that are compared in our experiments,
we introduce a reusable benchmarking framework, called _Comunica Bencher_.
<span class="comment" data-author="RV">Claim in abstract?</span>
<span class="comment" data-author="RV">Claim in conclusion!!!</span>
It ensures complete reproducible experimental results by
having declarative experiment descriptions build on top of [Comunica](cite:cites comunica),
a modular Linked Data querying framework.
This facilitates the reproduction of the experiments of this work,
as well as the creation of related experiments in the future.

The contributions of this work are the following:

* a BGP-based AMF algorithm to optimize client-side query execution over TPF;
* an analysis of HTTP caching and server-side AMF filter caching;
* a threshold-based mechanism for exposing AMFs by size in TPF servers;
* an analysis of network bandwidth in combination with different client-side AMF algorithms;
* server-side and client-side support for in-band HTTP AMF responses;
* an analysis of different AMF false-positive probabilities;
* a reusable benchmarking framework _Comunica Bencher_, using which the contributions above are evaluated extensively.

In the next section, we cover the related work pertaining to this article.
After that, we introduce our research questions in [](#problem-statement).
Next, we introduce our client-side algorithm in [](#solution).
In [](#evaluation), we introduce our experimental setup,
present our results, and test our hypotheses.
Finally, we draw conclusions in [](#conclusions).
