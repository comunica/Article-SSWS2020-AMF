## Evaluation
{:#evaluation}

This section should probably be bigger than it usually is.
First a part to explain the whole test setup and link to the relevant repositories.
Then we can describe all the dimensions and go over the different test groups one at a time (space permitting).
{:.todo}

### Reusable Benchmarking Framework

Different Linked Data Fragments approaches as discussed in [](#related-work-ldf)
usually require similar steps when running experiments.
Such _experiments require a significant amount of manual effort_
for setting up experiments, running them, and generating plots.
In order to avoid re-inventing the wheel again for this work, and for future works in this domain,
we developed a reusable benchmarking framework for Linked Data Fragments experiments, called _Comunica Bencher_.
This tool is based on [Docker](https://www.docker.com/), and allows isolated execution of experiments over different containers.
Experiment configuration are fully _declarative_, and they can exist in standalone repositories.
Comunica Bencher is _open-source_, and is available on GitHub.

Include link to anonymized source code dump.
{:.todo}

Concretely, Comunica Bencher offers the following abstraction:

1. Generating datasets and queries
2. Setting up a server, cache, and client.
3. Executing queries from the client against the server via the cache.
4. Collecting, analyzing and plotting results.

### Experimental Setup

### Results

### Discussion
