## Problem Statement
{:#problem-statement}

[Certain effects of using AMF metadata to improve query performance in the context of TPF were previously investigated](cite:cites amf2015).
The authors mainly focused on comparing two different AMF implementations with each other,
and their effects on query execution time.
This work has introduced a number of new follow-up questions,
and offers several points for improvement.
We list these as research questions for our work, and defined hypotheses for each of them:

1. {:#question-combine}
    **Can query evaluation be improved by _combining AMFs_ client-side?**
    <br />
    Ealier work focused on using AMF metadata to test the membership of fully materialized triples,
    while there is potential for exploiting this for other types of patterns in the query as well,
    e.g., by combining multiple AMFs.
    <br />
    **Hypotheses:**
    1. {:#hypo-combine-1} By combining AMFs client-side at BGP-level, query execution is faster compared to not using AMFs.
    2. {:#hypo-combine-2} By combining AMFs client-side at BGP-level, query execution is faster compared to using AMFs at triple-level.
    3. {:#hypo-combine-3} Using AMFs at both BGP _and_ triple-level is not faster w.r.t. query execution compared to only using AMFs at BGP-level.
2. {:#question-cache}
    **What query execution speedup does caching of HTTP requests and AMFs provide?**
    <br />
    As the authors of the earlier work on AMF suggest that caching of AMFs
    can reduce server delays and improve overall query evaluation,
    we will investigate the impact of caching AMFs and all HTTP requests in general.
    <br />
    **Hypotheses:**
    1. {:#hypo-cache-1} Caching HTTP requests reduces query evaluation times more than caching only AMFs.
    2. {:#hypo-cache-2} Caching AMFs server-side when an HTTP cache is active has no effect on query evaluation times.
    3. {:#hypo-cache-3} Without HTTP caching, AMF-aware query evaluation is slower than non-AMF query evaluation.
    4. {:#hypo-cache-4} With HTTP caching, AMF-aware query evaluation is faster than non-AMF query evaluation.
    5. {:#hypo-cache-5} Query evaluation with a cold cache is significantly slower than query evaluation with a warm cache.
    6. {:#hypo-cache-6} With a warm cache, Bloom filters achieve lower query evaluation times compared to GCS.
3. {:#question-dynamic-restriction}
    **To what extent can TPF server load be reduced by _dynamically restricting_ AMF generation?**
    <br />
    Earlier work introduced AMF as a feature that was always enabled.
    However, some specific AMFs may be too expensive for servers to calculate on the fly.
    As such, it may be beneficial to only _dynamically enable_ AMFs under specific circumstances,
    e.g., by only allowing AMFs to be requested for queries with result count lower than a certain threshold.
    <br />
    **Hypotheses:**
    1. {:#hypo-dynamic-restriction-1} Lower thresholds slow down query execution with cached AMFs.
    2. {:#hypo-dynamic-restriction-2} Lower thresholds reduce server load without cached AMFs.
    3. {:#hypo-dynamic-restriction-3} Lower thresholds do not impact server load with cached AMFs.
4. {:#question-bandwidth}
    **What impact does the HTTP bandwidth have on client-side performance with AMFs?**
    <br />
    Experiments in earlier work on AMF were based on limited HTTP bandwidth to a realistic 1Mbps.
    However, there is still an open question as to what extent different rates have an impact on the importance of AMF.
    <br />
    **Hypotheses:**
    1. {:#hypo-bandwidth-1} HTTP bandwith has a higher impact on non-AMF usage than triple-level AMF usage.
    2. {:#hypo-bandwidth-2} HTTP bandwith has a higher impact on triple-level AMF usage than BGP-level AMF usage.
5. {:#question-inband}
    **Can query throughput be improved by adding AMF metadata _in-band_ with the TPF HTTP responses?**
    <br />
    In previous work, AMF metadata was hidden behind a link that should be followed by the client to retrieve it,
    which requires an additional HTTP request.
    This opens the question as to whether including AMF metadata directly _in-band_
    with the TPF HTTP responses could improve query performance.
    <br />
    **Hypotheses:**
    1. {:#hypo-inband-1} In-band AMF metadata speeds up client-side query evaluation.
    2. {:#hypo-inband-2} In-band AMF metadata reduces the total amount of HTTP requests.
6. {:#question-probabilities}
    **Which AMF _false-positive probabilities_ achieve the best client-side query performance?**
    <br />
    Based on the results the previous authors have suggested that additional experimentation is needed with regards
    to lower _AMF false-positive probabilities_, as higher probabilities do not have a significant effect on query performance.
    <br />
    **Hypotheses:**
    1. {:#hypo-probabilities-1} Lower probabilities lead to faster client-side query execution.

To come up with an answer to these research questions,
their hypotheses will be tested in [](#evaluation) based on our experimental results.