import type { LandmarkCopyFamily } from "../../types";

export const biology_healthEN = {
  "green-pea": {
    title: "A green pea seed",
    shortTitle: "green pea seed",
    explanation: "One of the four equally likely combinations from two plants carrying yellow and green variants produces a green seed. Green is recessive, so both parents must pass on that variant.",
    calculation: "p = 1 green combination / 4 combinations = 1/4",
    assumptions: "This Yy × Yy breeding setup uses a simple one-gene Mendelian model. Peas with other parent genes can have different chances.",
  },
  "yellow-pea": {
    title: "A yellow pea seed",
    shortTitle: "yellow pea seed",
    explanation: "Three of the four equally likely combinations from two plants carrying yellow and green variants produce a yellow seed, because yellow is dominant.",
    calculation: "p = 3 yellow combinations / 4 combinations = 3/4",
    assumptions: "This Yy × Yy breeding setup uses a simple one-gene Mendelian model. Peas with other parent genes can have different chances.",
  },
  "double-yolk-young-hens": {
    title: "A double-yolk egg from young hens",
    shortTitle: "a double-yolk egg",
    explanation: "A production study reports about two double-yolk eggs per 100 eggs from young commercial laying hens near the onset of lay.",
    calculation: "p ≈ 0.02",
    assumptions: "The estimate applies to young laying hens near the onset of production. Age, genetics, diet, flock management, and egg sorting change the rate, so it is not a universal supermarket-egg probability.",
  },
  "dna-nucleotide-copied-correctly": {
    title: "One DNA nucleotide is copied correctly",
    shortTitle: "DNA nucleotide copied correctly",
    explanation: "A standard molecular-biology estimate gives about one mistake after proofreading and mismatch repair per billion nucleotides copied. That leaves about 999,999,999 copied correctly.",
    calculation: "p ≈ 1 − 10⁻⁹",
    assumptions: "This is a textbook order-of-magnitude estimate after proofreading and mismatch repair. Fidelity varies across organisms, cells, conditions, and repair systems. The event concerns one nucleotide, not an entire genome.",
  },
  "covid-scenario-prior": {
    title: "COVID infection before a rapid antigen test",
    shortTitle: "COVID · before test",
    explanation: "Imagine {population} asymptomatic people with suspected exposure taking a COVID test. At the hypothetical prevalence of {prevalence}%, {infected} of them are infected before testing.",
    calculation: "prior p = 0.005; prior odds = 0.005 / 0.995",
    assumptions: "The 0.5% prevalence is a hypothetical input, not a measured current prevalence or a personal risk estimate. The same infection hypothesis and population are used for both test-result updates.",
  },
  "covid-scenario-positive": {
    title: "COVID infection after a positive rapid antigen test",
    shortTitle: "COVID · positive",
    explanation: "Suppose {infected} people out of {population} are infected, or {prevalence}%. About {positiveTotal} test positive. Of those, {truePositive} are infected. The other {falsePositive} are the false positives. That is about a one-in-three chance of infection.",
    calculation: "p = (0.005 × 0.586) / [(0.005 × 0.586) + (0.995 × (1 − 0.994))] ≈ 0.3292",
    assumptions: "The calculation starts from the hypothetical 0.5% prevalence and uses pooled sensitivity 0.586 and specificity 0.994 for asymptomatic people with suspected exposure. These historical pooled estimates combine different tests and studies through February 2022. Performance varies by kit, timing, sampling, and setting. This calculation is not a personal diagnosis.",
  },
  "covid-scenario-negative": {
    title: "COVID infection after a negative rapid antigen test",
    shortTitle: "COVID · negative",
    explanation: "Suppose {infected} people out of {population} are infected, or {prevalence}%. About {negativeTotal} test negative. The test misses {falseNegative} infections among them, about one infected person in 479 negative results.",
    calculation: "p = (0.005 × (1 − 0.586)) / [(0.005 × (1 − 0.586)) + (0.995 × 0.994)] ≈ 0.00209",
    assumptions: "The calculation starts from the hypothetical 0.5% prevalence and uses pooled sensitivity 0.586 and specificity 0.994 for asymptomatic people with suspected exposure. These historical pooled estimates combine different tests and studies through February 2022. Performance varies by kit, timing, sampling, and setting. This calculation is not a personal diagnosis.",
  },
  "human-denovo-snv": {
    title: "A de novo DNA-letter mutation in one human generation",
    shortTitle: "new DNA-letter mutation",
    explanation: "A study of 283 Icelandic parent-offspring trios estimated about one new single-nucleotide variant per 77.5 million transmitted positions per generation, a rate of 1.29 × 10⁻⁸.",
    calculation: "p ≈ 1.29 × 10⁻⁸ per transmitted position per generation",
    assumptions: "The 95% confidence interval is 1.27–1.30 × 10⁻⁸ after coverage and callability correction. The observed study average was about 63 de novo SNVs per person. Rates vary with parental age and sequence context. This samples one transmitted position, not the chance that a child has any mutation or disease, and it differs from the cell-replication error model.",
  },
  "four-leaf-clover": {
    title: "A four-leaf white clover",
    shortTitle: "four-leaf white clover",
    explanation: "The cited estimate finds one white clover with four leaflets for every 5,076 with three. Among those three- and four-leaf clovers, that is one in 5,077.",
    calculation: "p ≈ 1 / (5,076 + 1) = 1 / 5,077",
    assumptions: "The comparison is restricted to three- or four-leaf white clovers. It is an approximate occurrence estimate rather than a precise worldwide survey. Genetics, environment, and the clover patch can change the rate. Search method, time, and patch choice determine the chance of finding one during a search.",
  },
} satisfies LandmarkCopyFamily;
