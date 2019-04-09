## Evaluation
{:#evaluation}

Include in ZIP: bencher, AMF modules, Server impl, AMF experiments
{:.todo}

The goal of this section is to answer the research questions from [](#problem-statement).
We start by introducing a reusable benchmarking framework to achieve fully reproducible results.
Next, we briefly discuss the implementations of our algorithm.
After that, we present our experimental setup and our statistical hypotheses.
Finally, we present our results and testing of our hypotheses.

### Reusable Benchmarking Framework

Different Linked Data Fragments approaches as discussed in [](#related-work-ldf)
usually require similar steps when running experiments.
Such experiments require a significant amount of manual effort
for setting up experiments, running them, and generating plots.
In order to avoid re-inventing the wheel, and for future works in this domain,
we developed a reusable benchmarking framework for Linked Data Fragments experiments, called _Comunica Bencher_.
This tool is based on [Docker](https://www.docker.com/), and allows isolated execution of experiments over different containers.
Experiment configurations are fully _declarative_, and they can exist in standalone repositories.
In order to share the conditions under which the experiment was executed,
a list of all [used _software versions and their dependencies_ in a Turtle document](cite:cites lsd)
will be generated after each run together with the evaluation results.
Comunica Bencher is _open-source_, and is available on [GitHub](https://github.com/comunica/comunica-bencher).
With this, our experiments are fully reproducible.

Concretely, Comunica Bencher offers abstraction of the following <a about="#evaluation-workflow" content="Comunica Bencher evaluation workflow" href="#evaluation-workflow" property="rdfs:label" rel="cc:license" resource="https://creativecommons.org/licenses/by/4.0/">workflow</a>:

<ol id="evaluation-workflow" property="schema:hasPart" resource="#evaluation-workflow" typeof="opmw:WorkflowTemplate" markdown="1">
<li id="workflow-data" about="#workflow-data" typeof="opmw:WorkflowTemplateProcess" rel="opmw:isStepOfTemplate" resource="#evaluation-workflow" property="rdfs:label" markdown="1">
  Generate a [WatDiv](cite:cites watdiv) dataset with a given scale factor.
</li>
<li id="workflow-queries" about="#workflow-queries" typeof="opmw:WorkflowTemplateProcess" rel="opmw:isStepOfTemplate" resource="#evaluation-workflow" property="rdfs:label" markdown="1">
  Generate the corresponding default WatDiv [queries](https://dsg.uwaterloo.ca/watdiv/basic-testing.shtml) with a given query count.
</li>
<li id="workflow-tpf-server" about="#workflow-tpf-server" typeof="opmw:WorkflowTemplateProcess" rel="opmw:isStepOfTemplate" resource="#evaluation-workflow" property="rdfs:label" markdown="1">
  Install [the LDF server software](https://github.com/LinkedDataFragments/Server.js){:.mandatory} with a given configuration, implementing the [TPF specification](https://www.hydra-cg.com/spec/latest/triple-pattern-fragments/).
</li>
<li id="workflow-cache" about="#workflow-cache" typeof="opmw:WorkflowTemplateProcess" rel="opmw:isStepOfTemplate" resource="#evaluation-workflow" property="rdfs:label" markdown="1">
  Setup an [NGINX HTTP cache](https://www.nginx.com/){:.mandatory} with a given configuration in front of the LDF server.
</li>
<li id="workflow-comunica" about="#workflow-comunica" typeof="opmw:WorkflowTemplateProcess" rel="opmw:isStepOfTemplate" resource="#evaluation-workflow" property="rdfs:label" markdown="1">
  Install [Comunica](cite:cites comunica) under a given configuration, implementing [SPARQL 1.1](https://www.w3.org/TR/sparql11-protocol).
</li>
<li id="workflow-comunica-run" about="#workflow-comunica-run" typeof="opmw:WorkflowTemplateProcess" rel="opmw:isStepOfTemplate" resource="#evaluation-workflow" property="rdfs:label" markdown="1">
  Execute the generated WatDiv queries a given number times on the Comunica client, after doing a warmup run, and record the execution times.
</li>
<li id="workflow-collect" about="#workflow-collect" typeof="opmw:WorkflowTemplateProcess" rel="opmw:isStepOfTemplate" resource="#evaluation-workflow" property="rdfs:label" markdown="1">
  For each experiment, plot the execution times for all combinations and queries next to each other.
</li>
</ol>

### Implementation

For implementing the client-side AMF algorithms,
we make use of JavaScript-based [Comunica SPARQL querying framework](cite:cites comunica).
Since Comunica already fully supports the TPF algorithm,
we could implement our algorithms as fully standalone plugins.
Our algorithms are implemented in separate Comunica modules,
and are available open-source on [GitHub](https://github.com/comunica/comunica-feature-amf).
Concretely, we implemented the original triple-based AMF algorithm,
our new BGP-based AMF algorithm (_BGP Simple_),
and a variant of this BGP-based algorithm (_BGP Combined_) that pre-fetches out-of-band AMFs in parallel.

The original TPF server extension in [the LDF server software](https://github.com/LinkedDataFragments/Server.js/tree/feature-handlers-amf)
by [Vander Sande et al.](cite:cites amf2015)
allowed both Bloom filters and GCS to be created on the fly for any triple pattern.
To support our experiments, we extended this implementation with new features.
This implementation is available on [GitHub](https://github.com/LinkedDataFragments/Server.js/tree/feature-handlers-amf-2).
In order to measure the server overhead of large AMFs,
we added a config option to dynamically enable AMFs for triple patterns
with number of matching triples below a given threshold.
Next to that, we implemented an optional file-based cache to avoid recomputing AMFs
to make pre-computation of AMFs possible.

### Experimental Setup

Based on our LDF server and Comunica implementations that were discussed in [](#implementation),
we defined five experiments, corresponding to our five research questions from [](#problem-statement).
For each experiment, we introduce hypotheses that will be statistically tested based on our results.
The declararive configuration files for running these experiments with Comunica Bencher are present on [GitHub](https://github.com/comunica/Experiments-AMF) under an open license,
and can be started from scratch by _executing a single command_.
Furthermore, all raw results and scripts for analyzing them can be found in this same repository.

The following experiments execute WatDiv with a dataset scale of 100
and a query count of 5 for the default query templates, leading to a total of 100 queries.
We only report results for Bloom filters for experiments
where no significant difference was measured with GCS.
Each experiment includes a warmup phase,
and averages results over 3 separate runs.
During this warmup phase, the server caches all generated AMFs.
For each query, 
the client-side timeout was set to 5 minutes and, to enforce a realistic Web bandwidth,
the network delay was set to 1024Kbps.
All experiments were executed on a 64-bit Ubuntu 14.04 machine with 128 GB of memory and a 24-core 2.40 GHz CPU---each Docker container was limited to one CPU core, behind an NGINX HTTP cache.

1. **Client-side AMF Algorithms**:
    In this experiment, we compare different client-side algorithms
    (_None, Triple, BGP Simple, BGP Combined, Triple with BGP Combined_)
    for using AMF metadata.
    <br />
    **Hypotheses:**
    1. {:#hypo-combine-1} By combining AMFs client-side at BGP-level, query execution time is lower compared to plain TPF.
    2. {:#hypo-combine-2} By combining AMFs client-side at BGP-level, query execution time is lower compared to using AMFs at triple-level.
    3. {:#hypo-combine-3} Using AMFs at both BGP _and_ triple-level does not reduce query execution time compared to only using AMFs at BGP-level.
2. **Caching**:
    In this experiment, we evaluate the effects of caching all HTTP requests combined with caching AMF filters server-side.
    We also compare the effects of using AMF metadata client-side or not.
    Finally, we test the effects of warm and cold caches.
    <br />
    **Hypotheses:**
    1. {:#hypo-cache-1} Caching all HTTP responses reduce query evaluation times more than caching only AMFs responses.
    2. {:#hypo-cache-2} Caching AMFs server-side when an HTTP cache is active has no effect on query evaluation times.
    3. {:#hypo-cache-3} Without HTTP caching, AMF-aware query evaluation is slower than non-AMF query evaluation.
    4. {:#hypo-cache-4} With HTTP caching, AMF-aware query evaluation is faster than non-AMF query evaluation.
    5. {:#hypo-cache-5} With a warm cache, Bloom filters achieve lower query evaluation times compared to GCS.
3. **Dynamically Enabling AMF**:
    In this experiment, we compare different result count thresholds (_0, 1.000, 10.000, 100.000, 1.000.000_) with each other,
    with either the server-side AMF filter cache enabled or not.
    We disable the HTTP cache and warmup phase to evaluate a cold-start.
    <br />
    **Hypotheses:**
    1. {:#hypo-dynamic-restriction-1} With cached AMFs, lower thresholds slow down query execution.
    2. {:#hypo-dynamic-restriction-2} Without cached AMFs, lower thresholds reduce server load.
    3. {:#hypo-dynamic-restriction-3} With cached AMFs, lower thresholds do not impact server load.
4. **Network Bandwidths**:
    Different network bandwidths (_256kbps, 512kbps, 2048kbps, 4096kbps_) are evaluated, and their effects or different AMF algorithms (_None, Triple, BGP Combined_) are tested.
    <br />
    **Hypotheses:**
    1. {:#hypo-bandwidth-1} HTTP bandwidth has a higher impact on non-AMF usage than triple-level AMF usage.
    2. {:#hypo-bandwidth-2} HTTP bandwidth has a higher impact on triple-level AMF usage than BGP-level AMF usage.
5. **False-positive Probabilities**:
    In this final experiment, we compare different AMF false-positive probabilities (_1/4096, 1/1024, 1/64, 1/4, 1/2_).
    <br />
    **Hypotheses:**
    1. {:#hypo-probabilities-1} Lower probabilities lead to faster client-side query execution.

### Results

In this section, we present the results for each of our experiments separately.
We tested our hypotheses statistically by comparing means using the Kruskal-Wallis test,
and report on their p-values (_low values indicate non-equal means_).

#### Client-side AMF Algorithms
{:.display-block}

<figure id="plot_client_algos">
<center>
<img src="img/experiments/client_algos/plot_no_c.svg" alt="Client-side AMF Algorithms (non-C)" class="plot_non_c">
<img src="img/experiments/client_algos/plot_c.svg" alt="Client-side AMF Algorithms (C)" class="plot_c">
</center>
<figcaption markdown="block">
Query evaluation times for the different client-side algorithms for using AMF metadata, lower is better.
BGP-based approaches are mostly faster.
</figcaption>
</figure>

[](#plot_client_algos) shows the query evaluation times for our first experiment
on the different client-side algorithms for using AMF metadata.
In line with what was shown in the [first TPF AMF experiments](cite:cites amf2015),
the triple-based algorithm reduces query evaluation times in only 2 of the 20 queries.
Our new BGP-based algorithms on the other hand reduce query evaluation times and outperforms the triple-based algorithm.
Only for 5 of the 20 queries, evaluation times are worse.
Our combined BGP algorithm is slightly faster than the simple BGP algorithm.
By using both the combined BGP-based and the triple-based algorithms, we can reduce evaluation times slightly further.

MVS: L1, L3 and C3 Have to be mentioned. Why are they slower? Is it significant? What would be possible solutions?
{:.todo}

Based on these results, we can confirm that there is _no statistically significant difference_ between the evaluation times of the triple-based AMF algorithm, and not using AMF metadata at all (_p-value: 0.9318_).
The simple and combined BGP algorithm are significantly faster than not using AMF metadata (_p-values: 0.0062, 0.0026_),
which confirms [Hypothesis 1.1](#hypo-combine-1).
Furthermore, the simple and combined BGP algorithm are on average
more than twice as fast as the triple-based algorithm,
which make them significantly faster (_p-values: 0.0090, 0.0041_)
and confirms [Hypothesis 1.2](#hypo-combine-2).
Furthermore, combining our simple and combined BGP algorithm with the triple-based algorithms
has no statistically significant effect (_p-values: 0.9484, 0.6689_), which confirms [Hypothesis 1.3](#hypo-combine-3).

#### Caching
{:.display-block}

<figure id="plot_caching">
<center>
<img src="img/experiments/caching/plot_no_c.svg" alt="Caching (non-C)" class="plot_non_c">
<img src="img/experiments/caching/plot_c.svg" alt="Caching (C)" class="plot_c">
</center>
<figcaption markdown="block">
Logarithmic query evaluation times comparing server-side HTTP and AMF caching.
Not caching anything is always slower than caching HTTP responses or AMFs.
</figcaption>
</figure>

[](#plot_caching) shows that caching either HTTP requests or AMF filters server-side has a significant positive effect on query evaluation (_p-value: < 2.2e-16_).
We observe that caching HTTP requests reduces query evaluation times _more_ than just caching AMF filters (_p-value: 0.0225_),
which conforms [Hypothesis 2.1](#hypo-cache-1).
Furthermore, there is no significant difference between query evaluation times for caching of both HTTP requests and AMF filters
compared to just caching HTTP requests (_p-value: 0.7694_), so we accept [Hypothesis 2.2](#hypo-cache-2).
This shows that an HTTP cache achieves the best results,
and additionally caching AMF filters server-side is not worth the effort.

If we compare these results with the results for non-AMF-aware querying,
we see that if HTTP caching is _disabled_, query evaluation times for non-AMF-aware querying are _significantly lower_ than AMF-aware approaches (_p-value: < 2.2e-16_), which confirms [Hypothesis 2.3](#hypo-cache-3).

MVS: also use _p-value: < 0.0001_ here, 2.2e-16 is just an artifact of the floating point system
{:.todo}

On the other hand, if HTTP caching is _enabled_, query evaluation times for non-AMF-aware querying are _significantly worse_ than with AMF-aware approaches (_p-value: < 0.0001_), which confirms [Hypothesis 2.4](#hypo-cache-4).
While caching is already very important for TPF-based querying,
these results show that caching becomes _even more important_ when AMFs are being used.

Finally, our results show that when our cache is warm, exposing Bloom filters instead of GCS achieves faster query evaluation times.
While there are a few outliers where GCS is two to three times slower,
the difference is only small in most cases, so we accept [Hypothesis 2.5](#hypo-cache-5) with a low significance (_p-value: 0.1786_).

#### Dynamically Enabling AMF
{:.display-block}

MVS: This experiment is not entirely clear: what exactly do count thresholds apply to and what is the effect (can't tell from the text)? Maybe add a bit more explanation in 5.3 (3)? And reprise here?
{:.todo}

<figure id="plot_server_metadata_enabled_cached">
<center>
<img src="img/experiments/server_metadata_enabled/plot_cached_no_c.svg" alt="Effect of AMF result count thresholds with HTTP cache (non-C)" class="plot_non_c">
<img src="img/experiments/server_metadata_enabled/plot_cached_c.svg" alt="Effect of AMF result count thresholds with HTTP cache (C)" class="plot_c">
</center>
<figcaption markdown="block">
Query evaluation times for different AMF result count thresholds for different AMF algorithms when HTTP caching is enabled.
Low result count thresholds slow down query execution.
</figcaption>
</figure>

<figure id="plot_server_metadata_enabled_notcached">
<center>
<img src="img/experiments/server_metadata_enabled/plot_notcached_no_c.svg" alt="Effect of AMF result count thresholds without HTTP cache (non-C)" class="plot_non_c">
<img src="img/experiments/server_metadata_enabled/plot_notcached_c.svg" alt="Effect of AMF result count thresholds without HTTP cache (C)" class="plot_c">
</center>
<figcaption markdown="block">
Query evaluation times for different AMF result count thresholds for different AMF algorithms when HTTP caching is disabled.
High result count thresholds slow down query execution.
</figcaption>
</figure>

<figure id="plot_threshold_serverload">
<center>
<img src="img/experiments/server_metadata_enabled/threshold_serverload.svg" alt="Server CPU usage for AMF result counts" class="plot_non_c">
</center>
<figcaption markdown="block">
Average server CPU usage increases when AMF result count thresholds increase
when caching is disabled, but much slower if caching is enabled.
</figcaption>
</figure>

[](#plot_server_metadata_enabled_cached) shows lower AMF result count thresholds
lead to higher query evaluation times when HTTP caching is enabled (_p-value: < 0.0001_),
which confirms [Hypothesis 3.1](#hypo-dynamic-restriction-1).
[](#plot_server_metadata_enabled_notcached) shows that AMF result count thresholds
also have an impact on query evaluation times when HTTP caching is disabled (_p-value: 0.0005_),
but it does not necessarily lower it.
For this experiment, setting the threshold to 10K leads to the lowest overall query evaluation times.

[](#plot_threshold_serverload) shows that lower AMF result count thresholds lead to lower server loads
when HTTP caching is disabled (_p-value: 0.0326_), which confirms [Hypothesis 3.2](#hypo-dynamic-restriction-2).
On the other hand, if HTTP caching is enabled,
there is no correlation between AMF result count threshold and server CPU usage (_p-value: 0.4577_), which confirms [Hypothesis 3.3](#hypo-dynamic-restriction-3)).

MVS: I would expect a spearman or pearson here
{:.todo}

This shows that if caching is enabled, result count threshold is not significantly important,
and may therefore be disabled to always expose AMFs.

MVS: For the understandability, it might help to not use 'result count threshold' here, but simply saying what it implies: "dynamically enabling AMFs based on the number of triples..."
{:.todo}

For this experiment, average CPU usage increased from 31.65% (no AMF) to 40.56% (all AMF) when caching is enabled.
Furthermore, when looking at the raw HTTP logs,
we observe that by _always_ exposing AMFs, we use 28.66% of the total number of HTTP requests compared to not exposing AMFs.
As such, AMFs significantly reduce the number of required HTTP requests.

MVS: The last paragraphs kind of dangles...wouldn't it make more senso to mix it with the H testing?
{:.todo}

#### Network Bandwidth
{:.display-block}

<figure id="plot_delay_none">
<center>
<img src="img/experiments/delay/plot_none_no_c.svg" alt="Effect of bandwidth on non-AMF (non-C)" class="plot_non_c">
<img src="img/experiments/delay/plot_none_c.svg" alt="Effect of bandwidth on non-AMF (C)" class="plot_c">
</center>
<figcaption markdown="block">
When AMF is not used, query evaluation times decrease, while the used bandwidth increases.
</figcaption>
</figure>

<figure id="plot_delay_triple">
<center>
<img src="img/experiments/delay/plot_triple_no_c.svg" alt="Effect of bandwidth on triple AMF (non-C)" class="plot_non_c">
<img src="img/experiments/delay/plot_triple_c.svg" alt="Effect of bandwidth on triple AMF (C)" class="plot_c">
</center>
<figcaption markdown="block">
Query evaluation times for the triple-based AMF algorithm
show a speedup with increased bandwidth.
</figcaption>
</figure>

<figure id="plot_delay_bgp">
<center>
<img src="img/experiments/delay/plot_bgp_no_c.svg" alt="Effect of bandwidth on BGP AMF (non-C)" class="plot_non_c">
<img src="img/experiments/delay/plot_bgp_c.svg" alt="Effect of bandwidth on BGP AMF (C)" class="plot_c">
</center>
<figcaption markdown="block">
Query evaluation times for the BGP-based AMF algorithm
show a speedup with increased bandwidth.
</figcaption>
</figure>

MVS: Suggestion: review the caption to directly say what is shown. I rewrote Fig 6. to illustrate.
{:.todo}

[](#plot_delay_none), [](#plot_delay_triple) and [](#plot_delay_bgp) show the effects of different bandwidths
on query evaluation times over different algorithms.
We observe that when not using AMF, or using the triple-level AMF algorithm,
lower bandwidths lead to higher query evaluation times, but higher bandwidths do not keep reducing evaluation times.

MVS: sentence above is not clear
{:.todo}

In contrast, the BGP-level AMF algorithm continiously becomes faster when bandwidth increases.

MVS: only now it became clear that 'different bandwidths' means you are speeding up the network, I'd make it more clear in the beginning.
{:.todo}

We do not measure any significant impact of bandwidth on both non-AMF usage and triple-level AMF usage (_p-values: 0.2905, 0.2306_), so we reject [Hypothesis 4.1](#hypo-bandwidth-1).
For BGP-level AMF, we measure a significant impact (_p-value: 0.0028_), which accepts [Hypothesis 4.2](#hypo-bandwidth-2).
This shows that _if_ BGP-level AMF is used,
then higher bandwidths can be exploited _more_ for faster query evaluation.

#### False-positive Probabilities
{:.display-block}

<figure id="plot_probabilities">
<center>
<img src="img/experiments/probabilities/plot_no_c.svg" alt="In-band vs out-band (non-C)" class="plot_non_c">
<img src="img/experiments/probabilities/plot_c.svg" alt="In-band vs out-band (C)" class="plot_c">
</center>
<figcaption markdown="block">
Query evaluation times comparing different false-positive probabilities for AMFs that are generated server-side.
Extremely low and high probabilities show a negative impact.
</figcaption>
</figure>

[](#plot_probabilities) shows that different false-positive probabilities have some impact on query evaluation times.
This impact has however only has a weak significance (_p-value: 0.1840_).
This means that we reject [Hypothesis 5.1](#hypo-probabilities-1)
in which we expected that lower false-positive probabilities lead to lower query evaluation times.
On average, a false-positive probability of 1/64 leads to the lowest overall query evaluation times for this experiment.
