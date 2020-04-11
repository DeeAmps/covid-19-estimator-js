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
  const impactInfectionsByRequestedTime = Math.floor(
    impactCurrentInfected * (2 ** Math.floor(convertToDays(data.timeToElapse, data.periodType) / 3))
  );
  const severeInfectionsByRequestedTime = Math.floor(
    severeImpactCurrentInfected
    * (2 ** Math.floor(convertToDays(data.timeToElapse, data.periodType) / 3))
  );
  const impactSevereCasesByRequestedTime = Math.floor(impactInfectionsByRequestedTime * 0.15);
  const severeCasesByRequestedTime = Math.floor(
    severeInfectionsByRequestedTime * 0.15
  );

  const results = {
    data,
    impact: {
      currentlyInfected: impactCurrentInfected,
      infectionsByRequestedTime: impactInfectionsByRequestedTime,
      severeCasesByRequestedTime: impactSevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: Math.floor(
        (data.totalHospitalBeds * 0.35) - impactSevereCasesByRequestedTime
      ),
      dollarsInFlight: Math.floor(
        (impactInfectionsByRequestedTime
          * data.region.avgDailyIncomePopulation
          * data.region.avgDailyIncomeInUSD)
          / Math.floor(convertToDays(data.timeToElapse, data.periodType))
      )
    },
    severeImpact: {
      currentlyInfected: severeImpactCurrentInfected,
      infectionsByRequestedTime: severeInfectionsByRequestedTime,
      severeCasesByRequestedTime,
      casesForICUByRequestedTime: Math.floor(
        severeInfectionsByRequestedTime * 0.15
      ),
      casesForVentilatorsByRequestedTime: Math.floor(
        severeInfectionsByRequestedTime * 0.02
      ),
      hospitalBedsByRequestedTime: Math.floor(
        (data.totalHospitalBeds * 0.35) - severeCasesByRequestedTime
      ),
      dollarsInFlight: Math.floor(
        (severeInfectionsByRequestedTime
          * data.region.avgDailyIncomePopulation
          * data.region.avgDailyIncomeInUSD)
          / Math.floor(convertToDays(data.timeToElapse, data.periodType))
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
