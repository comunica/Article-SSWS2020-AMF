## Evaluation
{:#evaluation}

The goal of this section is to answer the research questions from [](#problem-statement).
We start by introducing a reusable benchmarking framework to achieve fully reproducible results.
Next, we present our experimental setup, followed by the presentation of our results and testing of our hypotheses.
Finally, we discuss these results to answer our research questions.

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
Comunica Bencher is _open-source_, and is available on GitHub.
With this, our experiments are fully reproducible.

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
The declararive configuration files for running these experiments with Comunica Bencher are present on [GitHub](https://github.com/comunica/Experiments-AMF){:.mandatory} under an open license,
and can be started from scratch by _executing a single command_.
Furthermore, all raw results and scripts for analyzing them can be found in this same repository.

Anonimize link to repo
{:.todo}

All of the following experiments have several things in common, unless indicated otherwise.
First, they are all executed using WatDiv with a dataset scale of 100,
and a query count of 5 for the default query templates, leading to a total of 100 queries.
Each experiment includes a warmup phase,
and averages results over 3 separate runs.
During this warmup phase, the server caches all generated AMFs.
For each query, we configured a timeout of 5 minutes.
Furthermore, the default network delay has been configured to 1024Kbps to enforce a realistic Web bandwidth.
Finally, each experiment uses an NGINX HTTP cache,
and the client-side query timeout has been set to 5 minutes.
All experiments were executed on a 64-bit Ubuntu 14.04 machine with 128 GB of memory and a 24-core 2.40 GHz CPU,
with each Docker container being limited to a one CPU core.

1. **Client-side AMF Algorithms**:
    First, we compare different client-side algorithms (_None, Triple, BGP Simple, BGP Combined, Triple with BGP Combined_)
    for using AMF metadata.
    Next, we compare different constants for the BGP actor-skipping heurtistic.
    Finally, we compare the effects of exposing different AMF filter implementations (_Bloom, GCS_) server-side.
2. **Caching**:
    In this experiment, we evaluate the effects of caching all HTTP requests combined with caching AMF filters server-side.
    We also compare the effects of using AMF metadata client-side or not.
    Finally, we test the effects of warm and cold caches.
3. **Dynamically Enabling AMF**:
    In this experiment, we compare different result count thresholds (_0, 1.000, 10.000, 100.000, 1.000.000_) with each other,
    with either the server-side AMF filter cache enabled or not.
    We disable the HTTP cache and warmup phase to evaluate a cold-start.
4. **Network Bandwidths**:
    Different network bandwidths (_256kbps, 512kbps, 2048kbps, 4096kbps_) are evaluated, and their effects or different AMF algorithms (_None, Triple, BGP Combined_) are tested.
5. **In-band vs. Out-of-band**:
    For this experiment, we test the effects of different triple count thresholds (_0, 1.000, 10.000, 100.000, 1.000.000_) for exposing AMF metadata in-band or not.
6. **False-positive Probabilities**:
    In this final experiment, we compare different AMF false-positive probabilities (_1/4096, 1/2048, 1/1024, 1/128, 1/64, 1/8, 1/4, 1/2_).

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
<span class=comment data-author=RV>make text bigger; graphs should be single-color fills, no outlines</span>
<span class=comment data-author=RV>put some logic in the colors: none can be white-ish, BGPS and BGPC similar shades</span>

<figure id="plot_skip_bgp_heuristic">
<center>
<img src="img/experiments/skip_bgp_heuristic/plot_no_c.svg" alt="Client-side AMF Algorithms with BGP skipping heuristic (non-C)" class="plot_non_c">
<img src="img/experiments/skip_bgp_heuristic/plot_c.svg" alt="Client-side AMF Algorithms with BGP skipping heuristic (C)" class="plot_c">
</center>
<figcaption markdown="block">
Query evaluation times when enabling the heuristic in the client-side combined BGP algorithm.
The heuristic shows a slight improvement in most cases.
</figcaption>
</figure>

<figure id="plot_client_algos_dief">
<center>
<img src="img/experiments/client_algos/dief_time.svg" alt="Diefficiency values for Client-side AMF Algorithms" class="plot_non_c">
</center>
<figcaption markdown="block">
Time diefficiency metric values for the different client-side algorithms for using AMF metadata, higher is better.
C3 and S7 are excluded as they fail to produce results for BGP-based approaches.
BGP-based approaches start producing results later.
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

Based on these results, we can confirm that there is _no statistically significant difference_ between the evaluation times of the triple-based AMF algorithm, and not using AMF metadata at all (_p-value: 0.9318_).
The simple and combined BGP algorithm are significantly faster than not using AMF metadata (_p-values: 0.0062, 0.0026_),
which confirms [Hypothesis 1.1](#hypo-combine-1).
Furthermore, the simple and combined BGP algorithm are on average
more than twice as fast as the triple-based algorithm,
which make them significantly faster (_p-values: 0.0090, 0.0041_)
and confirms [Hypothesis 1.2](#hypo-combine-2).
Furthermore, combining our simple and combined BGP algorithm with the triple-based algorithms
has no statistically significant effect (_p-values: 0.9484, 0.6689_), which confirms [Hypothesis 1.3](#hypo-combine-3).

In [](#plot_skip_bgp_heuristic), we show the results where we apply the heuristic
for dynamically disabling the BGP heuristic based on different parameter values.
On average, setting the request size parameter value to 2000 has the lowest average evaluation time for this experiment.
This case achieves lower evaluation times for 19 of the 20 queries,
which is an improvement compared to not using the heuristic.
This improvement is however only small, and not statistically significant (_p-value: 0.1842_).
<span class=comment data-author=RV>thought so; let's not do this?</span>

[](#plot_client_algos_dief) shows the [time diefficiency metric](cite:cites diefficiency)
values for all queries over all client-side algorithms.
This metric is used to measure the continuous arrival rate of query results,
where higher values indicate faster result arrival rates.
For making comparisons possible, we scaled these values per query from 0 to 1.
The results show that querying without using AMF metadata achieves the highest diefficiency values.
This means that results start coming in sooner when AMF is not being used,
even though the time until the last result is produced is typically higher compared to when AMF _is_ used.

<span class=comment data-author=RV>These results might confuse reviewers, so we should consider carefully. although I like the discussion about it further down, it's interesting.</span>

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

If we compare these results with the results for non-AMF-aware querying,
we see that if HTTP caching is _disabled_, query evaluation times for non-AMF-aware querying are _significantly lower_ than AMF-aware approaches (_p-value: < 2.2e-16_), which confirms [Hypothesis 2.3](#hypo-cache-3).
On the other hand, if HTTP caching is _enabled_, query evaluation times for non-AMF-aware querying are _significantly worse_ than with AMF-aware approaches (_p-value: < 2.2e-16_), which confirms [Hypothesis 2.4](#hypo-cache-4).

Finally, our results show that when our cache is warm, exposing Bloom filters instead of GCS achieves faster query evaluation times.
While there are a few outliers where GCS is two to three times slower,
the difference is only small in most cases, so we accept [Hypothesis 2.5](#hypo-cache-5) with a low significance (_p-value: 0.1786_).

#### Dynamically Enabling AMF
{:.display-block}

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
Average server CPU usage when AMF result count thresholds increase does increases
when caching is enabled, but not if caching is disabled.
</figcaption>
</figure>

<span class="comment" data-author="RT">Pending deletion</span>

[](#plot_server_metadata_enabled_cached) shows lower AMF result count thresholds
lead to higher query evaluation times when HTTP caching is enabled (_p-value: 2.11e-07_),
which confirms [Hypothesis 3.1](#hypo-dynamic-restriction-1).
[](#plot_server_metadata_enabled_notcached) shows that AMF result count thresholds
also have an impact on query evaluation times when HTTP caching is disabled (_p-value: 0.0005_),
but it does not necessarily lower it. For this experiment, setting the threshold to 10K leads to the lowest overall query evaluation times.

[](#plot_threshold_serverload) shows that lower AMF result count thresholds lead to lower server loads
when HTTP caching is disabled (_p-value: 0.0326_), which confirms [Hypothesis 3.2](#hypo-dynamic-restriction-2).
On the other hand, if HTTP caching is enabled,
there is no correlation between AMF result count threshold and server CPU usage (_p-value: 0.4577_), which confirms [Hypothesis 3.3](#hypo-dynamic-restriction-3)).

#### Network Bandwidth
{:.display-block}

<figure id="plot_delay_none">
<center>
<img src="img/experiments/delay/plot_none_no_c.svg" alt="Effect of bandwidth on non-AMF (non-C)" class="plot_non_c">
<img src="img/experiments/delay/plot_none_c.svg" alt="Effect of bandwidth on non-AMF (C)" class="plot_c">
</center>
<figcaption markdown="block">
Query evaluation times when AMF is not used
show a speedup with increased bandwidth.
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

[](#plot_delay_none), [](#plot_delay_triple) and [](#plot_delay_bgp) show the effects of different bandwidths
on query evaluation times over different algorithms.
We observe that when not using AMF, or using the triple-level AMF algorithm,
lower bandwidths lead to higher query evaluation times, but higher bandwidths do not keep reducing evaluation times.
The BGP-level AMF algorithm on the other hand keeps becoming faster with increasing bandwidths.
We do not measure any significant impact of bandwidth on both non-AMF usage and triple-level AMF usage (_p-values: 0.2905, 0.2306_), so we reject [Hypothesis 4.1](#hypo-bandwidth-1).
For BGP-level AMF, we measure a significant impact (_p-value: 0.0028_), which accepts [Hypothesis 4.2](#hypo-bandwidth-2).

#### In-band vs. Out-of-band
{:.display-block}

<figure id="plot_in_vs_out_band">
<center>
<img src="img/experiments/in_vs_out_band/plot_no_c.svg" alt="In-band vs out-band (non-C)" class="plot_non_c">
<img src="img/experiments/in_vs_out_band/plot_c.svg" alt="In-band vs out-band (C)" class="plot_c">
</center>
<figcaption markdown="block">
Query evaluation times comparing out-of-band and in-band based on different
AMF triple count threshold show no major differences.
</figcaption>
</figure>

<span class="comment" data-author="RT">Pending deletion</span>

[](#plot_in_vs_out_band) shows query evaluation times for different possibilities for including AMF metadata in-band or out-of-band.
Statistically, there is no significant different difference between these combinations (_p-value: 0.7323_),
so we reject [Hypothesis 5.1](#hypo-inband-1).

Furthermore, when analyzing the HTTP logs, we observe only a very decrease (<1%) in the number of requests for in-band AMF metadata.
As this difference is insignificant (_p-value: 0.406_), we need to reject [Hypothesis 5.2](#hypo-inband-2)
in which we expected the number of HTTP requests to significantly increase when we moved AMF metadata out-of-band.

<span class="comment" data-author="RV">mja, caching… probably not that interesting. should go.</span>

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

<span class="comment" data-author="RT">Pending deletion</span>

[](#plot_probabilities) shows that different false-positive probabilities have some impact on query evaluation times.
This impact has however only has a weak significance (_p-value: 0.184_).
This means that we reject [Hypothesis 6.1](#hypo-probabilities-1)
in which we expected that lower false-positive probabilities lead to lower query evaluation times.
On average, a false-positive probability of 1/64 leads to the lowest overall query evaluation times for this experiment.

### Discussion
<span class="comment" data-author="RV">to conclusion, and make current conclusion subsection <q>Recommendations</q>?</span>

#### BGP-based Algorithms Improve Query Efficiency

Results show that our new client-side BGP-based algorithms that use AMF metadata
significantly reduce query evaluation times  (_[Research Question 1](#question-combine)_).
However, the are a few outliers where our new algorithms perform _worse_ than the triple-based algorithm.
Our results have shown that a heuristic that can decide whether or not to use the BGP-based algorithm can solve this problem,
but further research is needed to come up with a more general heuristic that works in a variety of cases
and is not overfitted to these experiments.
<span class="comment" data-author="RV">do we have evidence for overfitting?</span>

#### BGP-based Algorithms Postpone Time to First Results

Even though total query evaluation times for the AMF-aware algorithms are mostly lower,
the diefficiency values are typically also lower, which means that results come in at a lower rate.
<span class="comment" data-author="RV">last part not correct IMHO; the average rate must still be higher, right?</span>
The reason for this can be seen when analyzing the times at which each query result arrives, as can be seen with query F3 in [](#plot_query_times_F3),
and is observable for other queries as well.
This figure shows that the time-until-first-result is higher for BGP-based AMF algorithms.
This is because the BGP-based algorithms tends to use larger AMFs, which introduces a bottleneck when requesting them over HTTP.
Even though we have this overhead, the gains we get from this are typically worth it,
as results come in much faster once the AMFs have been downloaded.
This figure shows that dynamically switching between different algorithms may be interesting to investigate in future work.
Our bandwidth experiment results confirm this, and show that higher bandwidths
lead to even more performance gains for the BGP-level algorithms (_[Research Question 4](#question-bandwidth)_).
<span class="comment" data-author="RV"><em>very</em> well-made point. Although I now start to doubt the point of the diefficiency metric; it just considers those 0.5 where "None" has some results? That's a very harsh punishment for being a twice as late but two times as fast. Would be very different if all results arrived at second 2, but the curve is still nice. What a silly metric. But weren't there multiple dieff values in the original paper?</span>

<figure id="plot_query_times_F3">
<center>
<img src="img/experiments/client_algos/query_times_F3.svg" alt="Query Times for F3 over different Client-side AMF Algorithms" class="plot_non_c">
</center>
<figcaption markdown="block">
Query result arrival times for query F3 for the different client-side algorithms.
</figcaption>
</figure>

#### Pre-computation and Caching of AMFs is Essential

Our results show that AMF-aware querying only has a positive impact on query evaluation times
if the server can deliver AMF filters sufficiently fast (_[Research Question 2](#question-cache)_).
Furthermore, if no cache is active, AMF-aware querying performs _worse_ than non-AMF-aware querying.
Ideally, all AMFs should be pre-computed, but due to the large number of possible triple patterns in a dataset,
this is not feasible.
On the other hand, our results have shown that server-side on the fly creation of AMFs
only starts to have a significant impact for sizes larger than 10.000 (_[Research Question 3](#question-dynamic-restriction)_).

On a low-end machine (2,7 GHz Intel Core i5, 8GB RAM), creation of AMFs takes 0.0125 msec per triple,
which means that AMF creation of size 10.000 takes only 0.125 seconds.
As such, AMFs of size 10.000 or less can be created with acceptable durations for Web servers,
after which they can still be cached.

[](#plot_triple_pattern_counts) shows that there is only a very small number of triple patterns with a very large number of matches.
When setting the WatDiv dataset to a size of 10M triples, there are only 90 triple patterns with a size larger than 10.000.
Setting that size to 100M triples, this number increases to 255, so this is not a linear increase.
Due to this low number of very large patterns, we can easily pre-compute these offline before dataset publication time.
Since the WatDiv dataset achieves a high diversity of [_structuredness_, it is similar to real-world RDF datasets](cite:cites realism).
As such, this behavior can be generalized to other datasets with a similar structuredness.

<figure id="plot_triple_pattern_counts">
<center>
<img src="img/triple_pattern_counts/plot_counts.svg" alt="Triple pattern counts" class="plot_non_c">
</center>
<figcaption markdown="block">
Logarithmic plot of the number of matches for triple patterns in five datasets of varying sizes,
limited to the 1000 patterns with the most matches.
Triple patterns are sorted by decreasing number of matches.
</figcaption>
</figure>

#### Bloom Filters are Preferred over GCS with Active Cache

Results show that when AMFs are pre-computed,
Bloom filters achieve faster query evaluation times than GCS (_[Research Question 2](#question-cache)_).
This is because Bloom filter creation requires less effort client-side than GCS due to the simpler decompression,
at the cost of more server effort.
However, this higher server effort is negligible if AMFs can be pre-computed.
As such, we recommend Bloom filters to always be preferred over GCS, unless AMFs can not be cached.

#### Always Emit AMF Metadata Out-of-band

Our results show that either emitting AMF metadata in-band or out-of-band has no significant impact
on query evaluation times and the total number of HTTP requests (_[Research Question 5](#question-inband)_).
However, as there may be clients that do no understand AMF metadata,
there will be HTTP data transfer overhead when AMF metadata would be included in-band.
For this reason, we recommend emitting AMF metadata out-of-band without a significant loss in performance for AMF-aware client.

#### A Good Trade-off Between False-positive Probabilities and AMF Size

Lowering the false-positive probability of an AMF increases its size.
As we have seen that larger AMFs have an impact on query evaluation times,
we do not want AMFs to become too large.
On the other hand, we do not want the false-positive probabilities to become too low,
as that leads to more unneeded HTTP requests.
Our results have shown that a probability of 1/64 leads to an optimal trade-off for our experiments (_[Research Question 6](#question-probabilities)_).
However, further research is needed to investigate this trade-off for other types of datasets and queries.
