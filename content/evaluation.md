## Evaluation
{:#evaluation}

In order to answer the research questions from [](#problem-statement),
we evaluate our approach, and report their results.
We first introduce a reusable benchmarking framework to achieve fully reproducible results.

### Reusable Benchmarking Framework

Different Linked Data Fragments approaches as discussed in [](#related-work-ldf)
usually require similar steps when running experiments.
Such _experiments require a significant amount of manual effort_
for setting up experiments, running them, and generating plots.
In order to avoid re-inventing the wheel again for this work, and for future works in this domain,
we developed a reusable benchmarking framework for Linked Data Fragments experiments, called _Comunica Bencher_.
This tool is based on [Docker](https://www.docker.com/), and allows isolated execution of experiments over different containers.
Experiment configuration are fully _declarative_, and they can exist in standalone repositories.
In order to achieve deterministic reproducibility,
a summary of all [used _software versions and their dependencies_ in a Turtle document](cite:cites lsd)
will be generated after each run together with the evaluation results.
Comunica Bencher is _open-source_, and is available on GitHub.

Include link to anonymized source code dump.
{:.todo}

Concretely, Comunica Bencher offers abstraction of the following <a about="#evaluation-workflow" content="Comunica Bencher evaluation workflow" href="#evaluation-workflow" property="rdfs:label" rel="cc:license" resource="https://creativecommons.org/licenses/by/4.0/">evaluation workflow</a>:

<ol id="evaluation-workflow" property="schema:hasPart" resource="#evaluation-workflow" typeof="opmw:WorkflowTemplate" markdown="1">
<li id="workflow-data" about="#workflow-data" typeof="opmw:WorkflowTemplateProcess" rel="opmw:isStepOfTemplate" resource="#evaluation-workflow" property="rdfs:label" markdown="1">
  Generate a [WatDiv](cite:cites watdiv) dataset with a given scale factor.
</li>
<li id="workflow-queries" about="#workflow-queries" typeof="opmw:WorkflowTemplateProcess" rel="opmw:isStepOfTemplate" resource="#evaluation-workflow" property="rdfs:label" markdown="1">
  Generate the corresponding default WatDiv [queries](https://dsg.uwaterloo.ca/watdiv/basic-testing.shtml){:.mandatory} with a given query count.
</li>
<li id="workflow-tpf-server" about="#workflow-tpf-server" typeof="opmw:WorkflowTemplateProcess" rel="opmw:isStepOfTemplate" resource="#evaluation-workflow" property="rdfs:label" markdown="1">
  Install [the LDF server software](https://github.com/LinkedDataFragments/Server.js){:.mandatory} with a given configuration, implementing the [TPF specification](https://www.hydra-cg.com/spec/latest/triple-pattern-fragments/){:.mandatory}.
</li>
<li id="workflow-cache" about="#workflow-cache" typeof="opmw:WorkflowTemplateProcess" rel="opmw:isStepOfTemplate" resource="#evaluation-workflow" property="rdfs:label" markdown="1">
  Setup an [NGINX HTTP cache](https://www.nginx.com/){:.mandatory} with a given configuration in front of the LDF server.
</li>
<li id="workflow-comunica" about="#workflow-comunica" typeof="opmw:WorkflowTemplateProcess" rel="opmw:isStepOfTemplate" resource="#evaluation-workflow" property="rdfs:label" markdown="1">
  Install [the Comunica software](https://github.com/comunica/comunica){:.mandatory} under a given configuration, implementing the [SPARQL 1.1 protocol](https://www.w3.org/TR/sparql11-protocol){:mandatory}.
</li>
<li id="workflow-comunica-run" about="#workflow-comunica-run" typeof="opmw:WorkflowTemplateProcess" rel="opmw:isStepOfTemplate" resource="#evaluation-workflow" property="rdfs:label" markdown="1">
  Execute the generated WatDiv queries a given number times on the Comunica client, after doing a warmup run, and record the execution times.
</li>
<li id="workflow-collect" about="#workflow-collect" typeof="opmw:WorkflowTemplateProcess" rel="opmw:isStepOfTemplate" resource="#evaluation-workflow" property="rdfs:label" markdown="1">
  For each experiment, plot the execution times for all combinations and queries next to each other.
</li>
</ol>

### Experimental Setup

Based on our LDF server and Comunica implementations that were discussed in [](#implementation),
we defined six experiments, corresponding to our six research questions from [](#problem-statement).
Each experiment consists of a number of _factors_, over which all possible combinations are tested.
The declararive configuration files for running these experiments with Comunica Bencher are present on GitHub,
and can be started from scratch by _executing a single command_.

Include link to anonymized source code dump, experiment configs, raw results, and R code.
{:.todo}

Include skip-bgp-heurtistic and caching-none and warm-cold-cache and filter-types
{:.todo}

1. **Client-side AMF Algorithms**: Evaluation of different client-side algorithms for using AMF metadata.
    <br />
    Factors:
    1. Client-side AMF algorithm: None, Triple, BGP Simple, BGP Combined, Triple with BGP Combined
2. **Caching**: Evaluating the effects of caching TPFs and AMF filters.
    <br />
    Factors:
    1. General HTTP cache: enabled, disabled
    2. Dedicated AMF filter cache: enabled, disabled
3. **Dynamically Enabling AMF**: Evaluation of dynamically enabling AMF metadata.
    <br />
    *General HTTP cache and warmup phase is disabled in this experiment to evaluate cold-start.*
    <br />
    Factors:
    1. Result count threshold: 0, 1.000, 10.000, 100.000, 1.000.000
    2. Dedicated AMF filter cache: enabled, disabled
4. **HTTP Bandwidths**: Evaluation of different network bandwidths.
    <br />
    Factors:
    1. Network bandwidths: 256kbps, 512kbps, 2048kbps, 4096kbps
    2. Client-side AMF algorithm: None, Triple, BGP
5. **In-band vs. Out-of-band**: Evaluation of exposing AMF metadata in-band or not.
    <br />
    Factors:
    1. AMF triple count threshold: 0, 1.000, 10.000, 100.000, 1.000.000
6. **False-positive Probabilities**: Evaluation of different AMF false-positive Probabilities.
    <br />
    Factors:
    1. Probabilities: 1/4096, 1/2048, 1/1024, 1/128, 1/64, 1/8, 1/4, 1/2

All of these experiments have several things in common, unless indicated otherwise.
First, they are all executed using WatDiv with a dataset scale of 100,
and a query count of 5 for the default query templates, leading to a total of 100 queries.
Each experiment includes a warmup phase,
and averages results over 3 separate runs.
During this warmup phase, the server caches all generated AMFs.
Furthermore, the default network delay has been configured to 1024Kbps to enforce a realistic Web bandwidth.
Finally, each experiment uses an NGINX HTTP cache —unless indicated otherwise—,
and the client-side query timeout has been set to 5 minutes.

All experiments were executed on a 64-bit Ubuntu 14.04 machine with 128 GB of memory and a 24-core 2.40 GHz CPU.
On average, each experiment combination required 1,5 hours to execute.

### Results

We tested these hypotheses for equality using the Kruskal-Wallis test
{:.todo}

#### Client-side AMF Algorithms
{:.display-block}

<figure id="plot_client_algos">
<center>
<img src="img/experiments/client_algos/plot_no_c.svg" alt="Client-side AMF Algorithms (non-C)" class="plot_non_c">
<img src="img/experiments/client_algos/plot_c.svg" alt="Client-side AMF Algorithms (C)" class="plot_c">
</center>
<figcaption markdown="block">
Query evaluation times for the different client-side algorithms for using AMF metadata.
</figcaption>
</figure>

<figure id="plot_skip_bgp_heuristic">
<center>
<img src="img/experiments/skip_bgp_heuristic/plot_no_c.svg" alt="Client-side AMF Algorithms with BGP skipping heuristic (non-C)" class="plot_non_c">
<img src="img/experiments/skip_bgp_heuristic/plot_c.svg" alt="Client-side AMF Algorithms with BGP skipping heuristic (C)" class="plot_c">
</center>
<figcaption markdown="block">
Query evaluation times when enabling the heuristic in the client-side combined BGP algorithm.
</figcaption>
</figure>

<figure id="plot_client_algos_dief">
<center>
<img src="img/experiments/client_algos/dief_time.svg" alt="Diefficiency values for Client-side AMF Algorithms" class="plot_non_c">
</center>
<figcaption markdown="block">
Time diefficiency metric values for the different client-side algorithms for using AMF metadata.
C3 and S7 are excluded as they produce no results.
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

Based on these results, we can confirm that there is _no statistical difference_ between the evaluation times of the triple-based algorithm, and not using AMF metadata at all (_p-value: 0.9318_).
The simple and combined BGP algorithm are significantly faster than not using AMF metadata (_p-values: 0.0062, 0.0026_),
which confirms [Hypothesis 1.1](#hypo-combine-1).
Furthermore, the simple and combined BGP algorithm are significantly faster than the triple-based algorithm (_p-values: 0.0090, 0.0041_),
which confirms [Hypothesis 1.2](#hypo-combine-2).
Furthermore, combining our simple and combined BGP algorithm with the triple-based algorithms
has no statistically significant effect (_p-values: 0.9484, 0.6689_), which confirms [Hypothesis 1.3](#hypo-combine-3).

In [](#plot_skip_bgp_heuristic), we show the results where we apply the heuristic
for dynamically disabling the BGP heuristic based on different parameter values.
On average, setting the request size parameter value to 2000 has the lowest average evaluation time for this experiment.
This case only achieves higher evaluation times for 1 of the 20 queries,
which is an improvement compared to not using the heuristic.
This improvement is however only small, and not statistically significant (_p-value: 0.1842_).

[](#plot_client_algos_dief) shows the [time diefficiency metric](cite:cites diefficiency)
values for all queries over all client-side algorithms.
This metric is used to measure the continuous arrival rate of query results,
where higher values indicate faster result arrival rates.
For making comparisons between queries easier, we scaled these values per query from 0 to 1.
The results show that querying without using the AMF metadata achieves the highest diefficiency values.
This means that results start coming in sooner when AMF is not being used,
even though the time until the last result is produced is typically higher compared to when AMF _is_ used.

#### Caching
{:.display-block}

<figure id="plot_caching">
<center>
<img src="img/experiments/caching/plot_no_c.svg" alt="Caching (non-C)" class="plot_non_c">
<img src="img/experiments/caching/plot_c.svg" alt="Caching (C)" class="plot_c">
</center>
<figcaption markdown="block">
Logarithmic query evaluation times comparing server-side HTTP and AMF caching.
</figcaption>
</figure>

[](#plot_caching) clearly shows that caching either HTTP requests or AMF filters server-side has a significant positive effect on query evaluation (_p-value: < 2.2e-16_).
We observe that caching HTTP requests reduces query evaluation times _more_ than just caching AMF filters (_p-value: 0.0225_),
which conforms [Hypothesis 2.1](#hypo-cache-1).
Furthermore, there is no significant difference between query evaluation times for caching of both HTTP requests and AMF filters
compared to just caching HTTP requests (_p-value: 0.7694_), which accepts [Hypothesis 2.2](#hypo-cache-2).

If we compare these results with the results for non-AMF-aware querying,
we see that _if HTTP caching is disabled_, query evaluation times for non-AMF-aware querying are _significantly lower_ than AMF-aware approaches (_p-value: < 2.2e-16_), which confirms [Hypothesis 2.3](#hypo-cache-3).
On the other hand, _if HTTP caching is enabled_, query evaluation times for non-AMF-aware querying are _significantly higher_ than AMF-aware approaches (_p-value: < 2.2e-16_), which confirms [Hypothesis 2.4](#hypo-cache-4).

[Hypothesis 2.5](#hypo-cache-5)
{:.todo}

Finally, our results show that when our cache is warm, exposing Bloom filters instead of GCS achieves faster query evaluation times.
While there are a few outliers where GCS is two to three times slower,
the difference is only small in most cases, so we accept [Hypothesis 2.6](#hypo-cache-6) with a low significance (_p-value: 0.1786_).

#### Dynamically Enabling AMF
{:.display-block}

Write me
{:.todo}

#### HTTP Bandwidths
{:.display-block}

<figure id="plot_delay_none">
<center>
<img src="img/experiments/delay/plot_none_no_c.svg" alt="Effect of HTTP bandwidth on non-AMF (non-C)" class="plot_non_c">
<img src="img/experiments/delay/plot_none_c.svg" alt="Effect of HTTP bandwidth on non-AMF (C)" class="plot_c">
</center>
<figcaption markdown="block">
Query evaluation times for different HTTP bandwidths when AMF is not used.
</figcaption>
</figure>

<figure id="plot_delay_triple">
<center>
<img src="img/experiments/delay/plot_triple_no_c.svg" alt="Effect of HTTP bandwidth on triple AMF (non-C)" class="plot_non_c">
<img src="img/experiments/delay/plot_triple_c.svg" alt="Effect of HTTP bandwidth on triple AMF (C)" class="plot_c">
</center>
<figcaption markdown="block">
Query evaluation times for different HTTP bandwidths for the triple-based AMF algorithm.
</figcaption>
</figure>

<figure id="plot_delay_bgp">
<center>
<img src="img/experiments/delay/plot_bgp_no_c.svg" alt="Effect of HTTP bandwidth on BGP AMF (non-C)" class="plot_non_c">
<img src="img/experiments/delay/plot_bgp_c.svg" alt="Effect of HTTP bandwidth on BGP AMF (C)" class="plot_c">
</center>
<figcaption markdown="block">
Query evaluation times for different HTTP bandwidths for the BGP-based AMF algorithm.
</figcaption>
</figure>

[](#plot_delay_none), [](#plot_delay_triple) and [](#plot_delay_bgp) show the effects of different HTTP bandwidths
on query evaluation times over different algorithms.
We observe that when not using AMF, or using the triple-level AMF algorithm,
lower bandwidths lead to higher query evaluation times, but higher bandwidths do not keep reducing evaluation times.
The BGP-level AMF algorithm on the other hand keeps becoming faster with increased HTTP bandwidths.
Statistically, we don't measure any significant impact of HTTP bandwidth on both non-AMF usage and triple-level AMF usage (_p-values: 0.2905, 0.2306_), which rejects [Hypothesis 4.1](#hypo-bandwidth-1).
For BGP-level AMF, we measure a significant impact (_p-value: 0.0028_), which accepts [Hypothesis 4.2](#hypo-bandwidth-2).

#### In-band vs. Out-of-band
{:.display-block}

<figure id="plot_in_vs_out_band">
<center>
<img src="img/experiments/in_vs_out_band/plot_no_c.svg" alt="In-band vs out-band (non-C)" class="plot_non_c">
<img src="img/experiments/in_vs_out_band/plot_c.svg" alt="In-band vs out-band (C)" class="plot_c">
</center>
<figcaption markdown="block">
Query evaluation times comparing out-of-band and in-band based on different AMF triple count threshold.
</figcaption>
</figure>

[](#plot_in_vs_out_band) shows query evaluation times for different possibilities for including AMF metadata in-band or out-of-band.
Statistically, there is no significant different difference between these combinations (_p-value: 0.7323_),
which rejects [Hypothesis 5.1](#hypo-inband-1).

Furthermore, when analyzing the HTTP logs, we observe only a very small decrease (<1%) in the difference in number of requests.
As this difference is insignificant (_p-value: 0.406_), we can reject [Hypothesis 5.2](#hypo-inband-2)
in which we expected the number of HTTP requests to significantly decrease when we moved AMF metadata in-band.

#### False-positive Probabilities
{:.display-block}

<figure id="plot_probabilities">
<center>
<img src="img/experiments/probabilities/plot_no_c.svg" alt="In-band vs out-band (non-C)" class="plot_non_c">
<img src="img/experiments/probabilities/plot_c.svg" alt="In-band vs out-band (C)" class="plot_c">
</center>
<figcaption markdown="block">
Query evaluation times comparing different false-positive probabilities for AMFs that are generated server-side.
</figcaption>
</figure>

[](#plot_probabilities) shows that different false-positive probabilities have some impact on query evaluation times.
This impact has however only has a weak significance (_p-value: 0.184_).
This means that we reject [Hypothesis 6.1](#hypo-probabilities-1)
in which we expected that lower false-positive probabilities lead to lower query evaluation times.
On average, a false-positive probability of 1/64 leads to the lowest query evaluation times for this experiment.

### Discussion

Why are the results what they are?
{:.todo}


<figure id="plot_query_times_F3">
<center>
<img src="img/experiments/client_algos/query_times_F3.svg" alt="Query Times for F3 over different Client-side AMF Algorithms" class="plot_non_c">
</center>
<figcaption markdown="block">
Query result arrival times for query F3 for the different client-side algorithms.
</figcaption>
</figure>

Our results have shown that even though total query evaluation times for the AMF-aware algorithms are mostly lower,
the diefficiency values are typically lower, which means that results come in at a lower rate.
The reason for this can be seen when analyzing the times at which each query result arrives, as can be seen in [](#plot_query_times_F3),
but is observable for other queries as well.
This figure shows that the time-until-first-result is higher for BGP-based AMF algorithms.
This is because the BGP-based algorithms tends to use larger AMFs, which introduces a bottleneck when requesting them over HTTP.
Even though we have this overhead, the gains we get from this are typically worth it,
as results come in much faster once the AMFs have been downloaded.
Our HTTP bandwidth experiment results confirm this, and show that higher bandwidths
lead to even more performance gains for the BGP-level algorithms.

Future work: dynamically switching between algos to start producing results asap.
{:.todo}

This shows that using heuristics to determine when certain client-side algorithms have to be used can be beneficial,
but needs further investigation.
{:.todo}

In-band vs out-band has no effect. However, for clients that don't use AMF, this _will_ have an impact. Suggestion: do everything out-band.
The main bulk of requests are paged TPFs in any case, AMF is only a small subset.
{:.todo}

Server-side AMF filter caching has no significant effect when a HTTP cache is used.
{:.todo}

Caching is already important for pure TPF, but it is even more important for AMF-TPF, because of the high calc times for AMFs.
Without caching AMF performs worse than pure TPF, so in that case AMF has no benefits.
{:.todo}

When AMFs can be pre-computed, Bloom is faster than GCS.
This is because computation of Bloom requires more work than GCS.
However, decompression of GCS requires more work client-side, which explains the higher query eval times.
{:.todo}

<figure id="plot_triple_pattern_counts">
<center>
<img src="img/triple_pattern_counts/plot_counts.svg" alt="Triple pattern counts">
</center>
<figcaption markdown="block">
Logarithmic plot of the number of matches for triple patterns in five dataset over varying sizes,
limited to the 1000 patterns with the most matches.
</figcaption>
</figure>

Pre-computation is needed for AMFs of size 10.000. See [Hypothesis 2.4](#hypo-cache-4) and [RQ 3](#question-dynamic-restriction).
Say that only a small amount of AMFs exist with size >10.000 (realistic dataset) (73 for dataset of size 10M, TODO for 100M)
Motivate with [](#plot_triple_pattern_counts).
{:.todo}
