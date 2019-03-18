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
    2. {:#hypo-combine-3} Using AMFs at both BGP _and_ triple-level is not faster w.r.t. query execution compared to only using AMFs at BGP-level.
2. {:#question-precompute}
    **What query execution speedup do _pre-computed AMFs_ provide?**
    <br />
    As the authors of the earlier work on AMF suggest that pre-computation and caching of AMFs
    can reduce server delays and improve overall query evaluation,
    we will investigate the impact of pre-computing AMFs.
    <br />
    **Hypotheses:**
    1. {:#hypo-precompute-1} When all AMFs are pre-computed, AMF-aware client-side query execution is faster than non-AMF-aware execution.
    2. {:#hypo-precompute-2} GCS achieves faster client-side query execution than Bloom filters when pre-computed.
    3. {:#hypo-precompute-3} GCS achieves slower client-side query execution than Bloom filters when not pre-computed.
3. {:#question-dynamic-restriction}
    **To what extent can TPF server load be reduced by _dynamically restricting_ AMF generation?**
    <br />
    Earlier work introduced AMF as a feature that was always enabled.
    However, some specific AMFs may be too expensive for servers to calculate in bursts.
    As such, it may be beneficial to _dynamically enable_ AMFs only under specific circumstances,
    e.g., by only allowing AMFs to be requested for queries with result count lower than a certain threshold.
    <br />
    **Hypotheses:**
    1. {:#hypo-dynamic-restriction-1} AMF size is linearly correlated with the required server effort for AMF calculation.
    2. {:#hypo-dynamic-restriction-2} Server load is significantly reduced by caching AMFs.
    3. {:#hypo-dynamic-restriction-3} Lowering the result count threshold reduces server load.
    4. {:#hypo-dynamic-restriction-4} Lowering the result count threshold increases client-side query execution time.
4. {:#question-bandwidth}
    **What impact does the HTTP bandwidth have on client-side performance with AMFs?**
    <br />
    Experiments in earlier work on AMF were based on limited HTTP bandwidth to a realistic 1Mbps.
    However, there is still an open question as to what extent different rates have an impact on the importance of AMF.
    <br />
    **Hypotheses:**
    1. {:#hypo-bandwidth-1} The lower the HTTP bandwidth, the higher the positive effect of triple-level AMF usage.
    2. {:#hypo-bandwidth-2} The lower the HTTP bandwidth, the higher the positive effect of BGP-level AMF usage.
    2. {:#hypo-bandwidth-3} Triple-level AMF usage is less sensitive to HTTP bandwith variants than BGP-level AMF usage.
5. {:#question-inband}
    **Can query throughput be improved by adding AMF metadata _in-band_ with the TPF HTTP responses?**
    <br />
    In previous work, AMF metadata was hidden behind a link that should be followed by the client to retrieve it,
    which requires an additional HTTP request.
    This opens the question as to whether including AMF metadata directly _in-band_
    with the TPF HTTP responses could improve query performance.
    <br />
    **Hypotheses:**
    1. {:#hypo-inband-1} Including AMF metadata in-band reduces the total required number of HTTP requests.
    2. {:#hypo-inband-2} Including AMF metadata in-band reduces client-side query execution time.
    3. {:#hypo-inband-3} Bloom filters are more sensitive than GCS to query execution time when including AMF metadata in-band or not.
6. {:#question-probabilities}
    **Which AMF _false-positive probabilities_ achieve the best client-side query performance?**
    <br />
    Based on the results the previous authors have suggested that additional experimentation is needed with regards
    to lower _AMF false-positive probabilities_, as higher probabilities do not have a significant effect on query performance.
    <br />
    **Hypotheses:**
    1. {:#hypo-probabilities-1} The lower the false-positive probability, the faster the client-side query execution.

To come up with an answer to these research questions,
their hypotheses will be tested in [](#evaluation) based on our experimental results.