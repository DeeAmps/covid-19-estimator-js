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
  const impactCurrentInfected = data.reportCases * 10;
  const severeImpactCurrentInfected = data.reportCases * 50;
  const impactInfectionsByRequestedTime = Math.floor(
    impactCurrentInfected
      * 2 ** Math.floor(convertToDays(data.timeToElapse, data.periodType) / 3)
  );
  const severeInfectionsByRequestedTime = Math.floor(
    severeImpactCurrentInfected
      * 2 ** Math.floor(convertToDays(data.timeToElapse, data.periodType) / 3)
  );
  //   const impactSevereCasesByRequestedTime = Math.floor(impactInfectionsByRequestedTime * 0.15);
  const severeCasesByRequestedTime = Math.floor(
    severeInfectionsByRequestedTime * 0.15
  );

  const results = {
    data,
    impact: {
      currentlyInfected: impactCurrentInfected,
      infectionsByRequestedTime: impactInfectionsByRequestedTime,
      //   severeCasesByRequestedTime: impactSevereCasesByRequestedTime,
      dollarsInFlight: Math.floor(
        (impactInfectionsByRequestedTime
          * data.avgDailyIncomePopulation
          * data.avgDailyIncomeInUSD)
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
        data.totalHospitalBeds * 0.35 - severeCasesByRequestedTime
      ),
      dollarsInFlight: Math.floor(
        (severeInfectionsByRequestedTime
          * data.avgDailyIncomePopulation
          * data.avgDailyIncomeInUSD)
          / Math.floor(convertToDays(data.timeToElapse, data.periodType))
      )
    }
  };
  return results;
};

export default covid19ImpactEstimator;
