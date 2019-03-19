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

1. **Client-side AMF Algorithms**: Evaluation of different client-side algorithms for using AMF metadata.
    <br />
    Factors:
    1. Client-side AMF algorithm: None, Triple, BGP Simple, BGP Combined, Triple with BGP Combined
2. **Caching**: Evaluating the effects of caching TPFs and AMF filters.
    <br />
    Factors:
    1. General HTTP cache: enabled, disabled
    2. Dedicated AMF filter cache: enabled, disabled
3. **Dynamic AMF enablement**: Evaluation of dynamically enabling AMF metadata.
    <br />
    *General HTTP cache and warmup phase is disabled in this experiment to evaluate cold-start.*
    <br />
    Factors:
    1. Result count threshold: 0, 1.000, 10.000, 100.000, 1.000.000
    2. Dedicated AMF filter cache: enabled, disabled
4. **HTTP Delays**: Evaluation of different network delays.
    <br />
    Factors:
    1. Network delay: 256kbps, 512kbps, 2048kbps, 4096kbps
    2. Client-side AMF algorithm: None, Triple, BGP
5. **In-band vs. Out-band**: Evaluation of exposing AMF metadata in-band or not.
    <br />
    Factors:
    1. Result count threshold: 0, 1.000, 10.000, 100.000, 1.000.000
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

<figure id="client_algos">
<center>
<img src="img/experiments/client_algos/plot_no_c.svg" alt="Client-side AMF Algorithms (non-C)" class="plot">
<img src="img/experiments/client_algos/plot_c.svg" alt="Client-side AMF Algorithms (C)" class="plot">
</center>
<figcaption markdown="block">
Query evaluation times for the different client-side algorithms for using AMF metadata.
</figcaption>
</figure>

<figure id="skip_bgp_heuristic">
<center>
<img src="img/experiments/skip_bgp_heuristic/plot_no_c.svg" alt="Client-side AMF Algorithms with BGP skipping heuristic (non-C)" class="plot">
<img src="img/experiments/skip_bgp_heuristic/plot_c.svg" alt="Client-side AMF Algorithms with BGP skipping heuristic (C)" class="plot">
</center>
<figcaption markdown="block">
Query evaluation times when enabling the heuristic in the client-side combined BGP algorithm.
</figcaption>
</figure>

[](#client_algos) shows the query evaluation times for our first experiment
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

In [](#skip_bgp_heuristic), we show the results where we apply the heuristic
for dynamically disabling the BGP heuristic based on different parameter values.
On average, setting the request size parameter value to 2000 has the lowest average evaluation time.
This case only achieves higher evaluation times for 1 of the 20 queries,
which is an improvement compared to not using the heuristic.
This improvement is however only small, and not statistically significant (_p-value: 0.1842_).

### Discussion

Why are the results what they are?
{:.todo}

This shows that using heuristics to determine when certain client-side algorithms have to be used can be beneficial,
but needs further investigation.
{:.todo}
