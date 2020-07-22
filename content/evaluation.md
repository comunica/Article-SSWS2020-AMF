## Evaluation
{:#evaluation}

The goal of this section is to answer the research questions from [](#problem-statement).
First, we briefly discuss the implementations of our algorithm.
After that, we present our experimental setup, and we present our results.
All code and results results can be found on [GitHub](https://github.com/comunica/comunica-feature-amf){:.mandatory}.

### Implementation

For implementing the client-side AMF algorithms,
we make use of JavaScript-based [Comunica SPARQL querying framework](cite:cites comunica).
Since Comunica already fully supports the TPF algorithm,
we could implement our algorithms as fully standalone plugins.
Our algorithms are implemented in separate Comunica modules,
and will be available open-source on GitHub.
Concretely, we implemented the original triple-based AMF algorithm,
our new BGP-based AMF algorithm (_BGP Simple_),
and a variant of this BGP-based algorithm (_BGP Combined_) that pre-fetches AMFs in parallel.

The original TPF server extension in [the LDF server software](https://github.com/LinkedDataFragments/Server.js/tree/feature-handlers-amf)
by [Vander Sande et al.](cite:cites amf2015)
allowed both Bloom filters and GCS to be created on the fly for any triple pattern.
To support our experiments, we extended this implementation with new features.
This implementation is available on [GitHub](https://github.com/LinkedDataFragments/Server.js/tree/feature-handlers-amf-2){:.mandatory}.
In order to measure the server overhead of large AMFs,
we added a config option to dynamically enable AMFs for triple patterns
with number of matching triples below a given result count threshold.
Next to that, we implemented an optional file-based cache to avoid recomputing AMFs
to make pre-computation of AMFs possible.

### Experimental Setup

Based on our LDF server and Comunica implementations that were discussed in [](#implementation),
we defined five experiments, corresponding to our five research questions from [](#problem-statement).
These experiments are defined and executed using [Comunica Bencher](https://github.com/comunica/comunica-bencher){:.mandatory},
which is a Docker-based benchmark execution framework for evaluating Linked Data Fragments.
This enables reproducibility of these experiments, as they can be re-executed with a single command.

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
2. **Caching**:
    In this experiment, we evaluate the effects of caching all HTTP requests combined with caching AMF filters server-side,
    both following the LRU cache replacement strategy.
    We also compare the effects of using AMF metadata client-side or not.
    Finally, we test the effects of warm and cold caches.
3. **Dynamically Enabling AMF**:
    In this experiment, we compare different result count thresholds (_0, 1.000, 10.000, 100.000, 1.000.000_) with each other,
    with either the server-side AMF filter cache enabled or not.
    We disable the HTTP cache and warmup phase to evaluate a cold-start.
4. **Network Bandwidths**:
    Different network bandwidths (_256kbps, 512kbps, 2048kbps, 4096kbps_) are tested for evaluating network speedups,
    and their effects or different AMF algorithms (_None, Triple, BGP Combined_) are tested.
5. **False-positive Probabilities**:
    In this final experiment, we compare different AMF false-positive probabilities (_1/4096, 1/1024, 1/64, 1/4, 1/2_).

### Results

In this section, we present the results for each of our experiments separately.
We analyzed our results statistically by comparing means using the Kruskal-Wallis test,
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

<figure id="plot_query_times_F3">
<center>
<img src="img/experiments/client_algos/query_times_F3.svg" alt="Query Times for F3 over different Client-side AMF Algorithms" class="plot_non_c">
</center>
<figcaption markdown="block">
Query result arrival times for query F3 for the different client-side algorithms.
BGP-based algorithms introduce a delay until first result, but produce results at a higher rate after this delay.
</figcaption>
</figure>

<figure id="http_requests_cache" markdown="1">

| Approach    | Requests  | Relative requests | Cache hits | Cache hit rate |
| ----------- | ---------:| -----------------:| ----------:| --------------:|
| None        | 1,911,845 |           100.00% | 1,686,889  | 88.23%         |
| Triple      | 1,837,886 |            96.13% | 1,626,611  | 88.50%         |
| BGPSimple   | 191,764   |            10.03% | 173,617    | 90.53%         |
| BGPCombined | 191,768   |            10.03% | 173,621    | 90.53%         |
| TripleBGP   | 191,773   |            10.03% | 173,626    | 90.53%         |

<figcaption markdown="block">
Number of HTTP requests, number of HTTP requests relative to not using AMFs, number of cache hits and cache hit rate for the different client-side algorithms.
BGP-based algorithms require significantly fewer HTTP requests.
</figcaption>
</figure>

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

[](#plot_client_algos) shows the query evaluation times for our first experiment
on the different client-side algorithms for using AMF metadata.
In line with what was shown in the [first TPF AMF experiments](cite:cites amf2015),
the triple-based algorithm reduces query evaluation times in only 2 of the 20 queries.
Our new BGP-based algorithms on the other hand reduce query evaluation times and outperforms the triple-based algorithm.
Only for 5 of the 20 queries, evaluation times are higher or equal.
Our combined BGP algorithm is slightly faster than the simple BGP algorithm.
By using both the combined BGP-based and the triple-based algorithms, we can reduce evaluation times slightly further.

[](#plot_query_times_F3) shows the query result arrival times for query F3,
and is similar to the arrival times for other queries.
This figure shows that the time-until-first-result is the highest for BGP-based AMF algorithms.
However, once this first results comes in, the arrival rate becomes much higher compared to the other algorithms.
This delay for the BGP-based algorithms is caused by the higher download times for large AMFs,
and explains the higher or equal evaluation times for 5 of the 20 queries.

[](#http_requests_cache) shows the BGP-based algorithms significantly lower the number of required HTTP requests,
which explains the significant reduction in query execution times.
This allows the NGINX cache hit rate to slightly increase compared to the regular and triple-based TPF algorithms,
since fewer requests are made, which lowers the number of required cache evictions.

Based on these results, there is _no statistically significant difference_
between the evaluation times of the triple-based AMF algorithm, and not using AMF metadata at all (_p-value: 0.9318_).
The simple and combined BGP algorithms are significantly faster than not using AMF metadata (_p-values: 0.0062, 0.0026_).
Furthermore, the simple and combined BGP algorithm are on average
more than twice as fast as the triple-based algorithm,
which make them significantly faster (_p-values: 0.0090, 0.0041_).
Furthermore, combining our simple and combined BGP algorithm with the triple-based algorithms
shows no further statistically significant improvement (_p-values: 0.9484, 0.6689_).

In [](#plot_skip_bgp_heuristic), we show the results where we apply the heuristic
for dynamically disabling the BGP heuristic based on different parameter values.
On average, setting the request size parameter value to 2000 has the lowest average evaluation time for this experiment.
This case achieves lower evaluation times for 19 of the 20 queries,
which is an improvement compared to not using the heuristic.
This improvement by itself however only small, and not statistically significant (_p-value: 0.1842_).

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

[](#plot_caching) shows that caching either HTTP requests or AMF filters server-side has a significant positive effect on query evaluation times (_p-value: < 0.0001_).
We observe that caching HTTP requests reduces query evaluation times _more_ than just caching AMF filters (_p-value: 0.0225_).
Furthermore, there is no significant difference between query evaluation times for caching of both HTTP requests and AMF filters
compared to just caching HTTP requests (_p-value: 0.7694_).
This shows that an HTTP cache achieves the best results,
and additionally caching AMF filters server-side is not worth the effort.

If we compare these results with the results for non-AMF-aware querying,
we see that if HTTP caching is _disabled_, query evaluation times for non-AMF-aware querying are _significantly lower_ than AMF-aware approaches (_p-value: < 0.0001_).
On the other hand, if HTTP caching is _enabled_, query evaluation times for non-AMF-aware querying are _significantly worse_ than with AMF-aware approaches (_p-value: < 0.0001_).
While caching is already very important for TPF-based querying,
these results show that caching becomes _even more important_ when AMFs are being used.

Finally, our results show that when our cache is warm, exposing Bloom filters instead of GCS achieves faster query evaluation times.
While there are a few outliers where GCS is two to three times slower,
the difference is only small in most cases (_p-value: 0.1786_).

#### Dynamically Enabling AMF
{:.display-block}

<figure id="plot_server_metadata_enabled_cached">
<center>
<img src="img/experiments/server_metadata_enabled/plot_cached_no_c.svg" alt="Effect of AMF result count thresholds with HTTP cache (non-C)" class="plot_non_c">
<img src="img/experiments/server_metadata_enabled/plot_cached_c.svg" alt="Effect of AMF result count thresholds with HTTP cache (C)" class="plot_c">
</center>
<figcaption markdown="block">
Query evaluation times for different AMF result count thresholds and AMF algorithms when HTTP caching is enabled.
Low result count thresholds slow down query execution.
</figcaption>
</figure>

<figure id="plot_server_metadata_enabled_notcached">
<center>
<img src="img/experiments/server_metadata_enabled/plot_notcached_no_c.svg" alt="Effect of AMF result count thresholds without HTTP cache (non-C)" class="plot_non_c">
<img src="img/experiments/server_metadata_enabled/plot_notcached_c.svg" alt="Effect of AMF result count thresholds without HTTP cache (C)" class="plot_c">
</center>
<figcaption markdown="block">
Query evaluation times for different AMF result count thresholds and AMF algorithms when HTTP caching is disabled.
High result count thresholds slow down query execution.
</figcaption>
</figure>

<figure id="plot_threshold_serverload">
<center>
<img src="img/experiments/server_metadata_enabled/threshold_serverload.svg" alt="Server CPU usage for AMF result counts" class="plot_non_c" style="width: 18em !important;">
</center>
<figcaption markdown="block">
Average server CPU usage increases when AMF result count thresholds increase
when caching is disabled, but much slower if caching is enabled.
</figcaption>
</figure>

[](#plot_server_metadata_enabled_cached) shows lower server-side AMF result count thresholds
lead to higher query evaluation times when HTTP caching is enabled (_p-value: < 0.0001_).
[](#plot_server_metadata_enabled_notcached) shows that AMF result count thresholds
also have an impact on query evaluation times when HTTP caching is disabled (_p-value: 0.0005_),
but it does not necessarily lower it.
For this experiment, setting the threshold to 10K leads to the lowest overall query evaluation times.

[](#plot_threshold_serverload) shows that lower AMF result count thresholds lead to lower server loads
when HTTP caching is disabled (_p-value: 0.0326_).
On the other hand, if HTTP caching is enabled,
there is no correlation (_Pearson_) between AMF result count threshold and server CPU usage (_p-value: 0.4577_).
This shows that if caching is enabled, dynamically enabling AMFs based on the number of triples
is not significantly important,
and may therefore be disabled to always expose AMFs.

For this experiment, average CPU usage increased from 31.65% (no AMF) to 40.56% (all AMF) when caching is enabled.
Furthermore, when looking at the raw HTTP logs,
we observe that by _always_ exposing AMFs, we use 28.66% of the total number of HTTP requests compared to not exposing AMFs.
As such, AMFs significantly reduce the number of HTTP requests at the cost of ~10% more server load.

#### Network Bandwidth
{:.display-block}

<figure id="plot_delay_none">
<center>
<img src="img/experiments/delay/plot_none_no_c.svg" alt="Effect of bandwidth on non-AMF (non-C)" class="plot_non_c">
<img src="img/experiments/delay/plot_none_c.svg" alt="Effect of bandwidth on non-AMF (C)" class="plot_c">
</center>
<figcaption markdown="block">
When AMF is not used, query evaluation times decrease with increased bandwidth up until 2048kbps.
</figcaption>
</figure>

<figure id="plot_delay_triple">
<center>
<img src="img/experiments/delay/plot_triple_no_c.svg" alt="Effect of bandwidth on triple AMF (non-C)" class="plot_non_c">
<img src="img/experiments/delay/plot_triple_c.svg" alt="Effect of bandwidth on triple AMF (C)" class="plot_c">
</center>
<figcaption markdown="block">
When the triple-based AMF algorithm is used, query evaluation times also decrease with increased bandwidth up until 2048kbps.
</figcaption>
</figure>

[](#plot_delay_none), [](#plot_delay_triple) and [](#plot_delay_bgp) show the effects of different bandwidths
on query evaluation times over different algorithms.
We observe that when not using AMF, or using the triple-level AMF algorithm,
lower bandwidths lead to higher query evaluation times.
However, when bandwidths become much higher,
query evaluation times decrease at a lower rate.
In contrast, the BGP-level AMF algorithm continuously becomes faster when bandwidth increases.
We do not measure any significant impact of bandwidth on both non-AMF usage and triple-level AMF usage (_p-values: 0.2905, 0.2306_).
For BGP-level AMF, we measure a significant impact (_p-value: 0.0028_).
This shows that _if_ BGP-level AMF is used,
then higher bandwidths can be exploited _more_ for faster query evaluation.

<figure id="plot_delay_bgp">
<center>
<img src="img/experiments/delay/plot_bgp_no_c.svg" alt="Effect of bandwidth on BGP AMF (non-C)" class="plot_non_c">
<img src="img/experiments/delay/plot_bgp_c.svg" alt="Effect of bandwidth on BGP AMF (C)" class="plot_c">
</center>
<figcaption markdown="block">
When the BGP-based AMF algorithm is used, query evaluation times decrease with increased bandwidth, even for more than 2048kbps,
showing that this algorithm can make better use of higher bandwidths.
</figcaption>
</figure>

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

[](#plot_probabilities) shows that different false-positive probabilities have impact on query evaluation times.
This impact has however only a weak significance (_p-value: 0.1840_).
On average, a false-positive probability of 1/64 leads to the lowest overall query evaluation times for this experiment.
