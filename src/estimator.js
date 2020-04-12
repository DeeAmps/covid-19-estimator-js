const convertToDays = (duration, periodType) => {
  if (periodType === 'days') {
    return duration;
  }
  if (periodType === 'weeks') {
    return duration * 7;
  }
  if (periodType === 'months') {
    return duration * 30;
  }
  return duration;
};

const covid19ImpactEstimator = (data) => {
  const impactCurrentInfected = data.reportedCases * 10;
  const severeImpactCurrentInfected = data.reportedCases * 50;
  const impactInfectionsByRequestedTime = Math.trunc(
    impactCurrentInfected * (2 ** Math.trunc(convertToDays(data.timeToElapse, data.periodType) / 3))
  );
  const severeInfectionsByRequestedTime = Math.trunc(
    severeImpactCurrentInfected
    * (2 ** Math.trunc(convertToDays(data.timeToElapse, data.periodType) / 3))
  );
  const impactSevereCasesByRequestedTime = Math.trunc(impactInfectionsByRequestedTime * 0.15);
  const severeCasesByRequestedTime = Math.trunc(
    severeInfectionsByRequestedTime * 0.15
  );

  const results = {
    data,
    impact: {
      currentlyInfected: impactCurrentInfected,
      infectionsByRequestedTime: impactInfectionsByRequestedTime,
      severeCasesByRequestedTime: impactSevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: Math.trunc(
        (data.totalHospitalBeds * 0.35) - impactSevereCasesByRequestedTime
      ),
      dollarsInFlight: Math.trunc(
        (impactInfectionsByRequestedTime
          * data.region.avgDailyIncomePopulation
          * data.region.avgDailyIncomeInUSD)
          / 30
      ),
      casesForICUByRequestedTime: Math.trunc(
        impactInfectionsByRequestedTime * 0.15
      ),
      casesForVentilatorsByRequestedTime: Math.trunc(
        impactInfectionsByRequestedTime * 0.02
      )
    },
    severeImpact: {
      currentlyInfected: severeImpactCurrentInfected,
      infectionsByRequestedTime: severeInfectionsByRequestedTime,
      severeCasesByRequestedTime,
      casesForICUByRequestedTime: Math.trunc(
        severeInfectionsByRequestedTime * 0.15
      ),
      casesForVentilatorsByRequestedTime: Math.trunc(
        severeInfectionsByRequestedTime * 0.02
      ),
      hospitalBedsByRequestedTime: Math.trunc(
        (data.totalHospitalBeds * 0.35) - severeCasesByRequestedTime
      ),
      dollarsInFlight: Math.trunc(
        (severeInfectionsByRequestedTime
          * data.region.avgDailyIncomePopulation
          * data.region.avgDailyIncomeInUSD)
          / 30
      )
    }
  };
  return results;
};

// const res = covid19ImpactEstimator({
//   region: {
//     name: 'Africa',
//     avgAge: 19.7,
//     avgDailyIncomeInUSD: 5,
//     avgDailyIncomePopulation: 0.71
//   },
//   periodType: 'days',
//   timeToElapse: 58,
//   reportedCases: 674,
//   population: 66622705,
//   totalHospitalBeds: 1380614
// });
// console.log(res);

export default covid19ImpactEstimator;
