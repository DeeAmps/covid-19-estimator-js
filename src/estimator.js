const getNumberOfDays = (periodType, timeToElapse) => {
  switch (periodType) {
    case 'months':
      return timeToElapse * 30;
    case 'weeks':
      return timeToElapse * 7;
    default:
      return timeToElapse;
  }
};

const calcHospitalSpace = (hospitalBeds, cases) => Math.trunc(hospitalBeds * 0.35 - cases);

const calcReqIcuCare = (severe) => Math.trunc(severe * 0.05);

const calcReqVent = (severe) => Math.trunc(severe * 0.02);

const calcDollarsInFlight = (inf, dayInc, pi, p) => Math.trunc((inf * dayInc * pi) / p);

const calculateImpact = (data) => {
  const {
    reportedCases,
    periodType,
    timeToElapse,
    totalHospitalBeds,
    region
  } = data;

  const impact = {};

  
  impact.currentlyInfected = reportedCases * 10;

  const infectionRate = Math.trunc(
    getNumberOfDays(periodType, timeToElapse) / 3
  );

  impact.infectionsByRequestedTime = Math.trunc(
    impact.currentlyInfected * 2 ** infectionRate
  );

  impact.severeCasesByRequestedTime = Math.trunc(
    impact.infectionsByRequestedTime * 0.15
  );

  impact.hospitalBedsByRequestedTime = calcHospitalSpace(
    totalHospitalBeds,
    impact.severeCasesByRequestedTime
  );

  impact.casesForICUByRequestedTime = calcReqIcuCare(
    impact.infectionsByRequestedTime
  );

  impact.casesForVentilatorsByRequestedTime = calcReqVent(
    impact.infectionsByRequestedTime
  );

  impact.dollarsInFlight = calcDollarsInFlight(
    impact.infectionsByRequestedTime,
    region.avgDailyIncomeInUSD,
    region.avgDailyIncomePopulation,
    getNumberOfDays(periodType, timeToElapse)
  );

  return impact;
};

const calculateSevereImpact = (data) => {
  const {
    reportedCases,
    periodType,
    timeToElapse,
    totalHospitalBeds,
    region
  } = data;

  const severeImpact = {};

  severeImpact.currentlyInfected = reportedCases * 50;

  const infectionRate = Math.trunc(getNumberOfDays(periodType, timeToElapse) / 3);

  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * 2 ** infectionRate;

  severeImpact.severeCasesByRequestedTime = severeImpact.infectionsByRequestedTime * 0.15;

  severeImpact.hospitalBedsByRequestedTime = calcHospitalSpace(
    totalHospitalBeds,
    severeImpact.severeCasesByRequestedTime
  );

  severeImpact.casesForICUByRequestedTime = calcReqIcuCare(
    severeImpact.infectionsByRequestedTime
  );

  severeImpact.casesForVentilatorsByRequestedTime = calcReqVent(
    severeImpact.infectionsByRequestedTime
  );

  severeImpact.dollarsInFlight = calcDollarsInFlight(
    severeImpact.infectionsByRequestedTime,
    region.avgDailyIncomeInUSD,
    region.avgDailyIncomePopulation,
    getNumberOfDays(periodType, timeToElapse)
  );

  return severeImpact;
};

const covid19ImpactEstimator = (data) => {
  const impact = calculateImpact(data);
  const severeImpact = calculateSevereImpact(data);

  return {
    data,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
