'use client'
import { TextField } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [inputs, setInputs] = useState({
    production: "",
    kilnFiring: "",
    kilnDiameter: "",
    kilnLength: "",
    liningThickness: "",
    inclination: "",
    speed: "",
  });

  const [results, setResults] = useState({});

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: parseFloat(e.target.value),
    });
  };

  const validateInputs = () => {
    return Object.values(inputs).every((value) => value !== "" && !isNaN(value));
  };

  const calculateResults = () => {
    if (!validateInputs()) {
      alert("Please fill out all input fields with valid numbers.");
      return;
    }

    const { production, kilnFiring, kilnDiameter, kilnLength, liningThickness, inclination, speed } = inputs;

    const kilnInternalDiameter = kilnDiameter - (2 * liningThickness) / 1000;
    const slope = (Math.atan(inclination / 100) * 180) / Math.PI;
    const ratioL_Do = kilnLength / kilnDiameter;
    const ratioL_Di = kilnLength / kilnInternalDiameter;

    const estimatedBurningZoneLength = kilnInternalDiameter > 3.5 ? 5 : 6;
    const estimatedCoatingLength = kilnInternalDiameter > 4.15 ? 5.5 : 6.5;
    const kilnInternalArea = (Math.PI / 4) * kilnInternalDiameter ** 2;

    const fillingDegree = (2.48 * ratioL_Di * production) / (Math.PI / 4 * kilnInternalDiameter ** 2 * kilnLength * inclination * speed);
    const kilnInternalFreeArea = kilnInternalArea * (1 - 0.01 * fillingDegree);

    const volumeOfKiln = kilnInternalArea * kilnLength;
    const volumetricLoad = production / volumeOfKiln;
    const retentionTime = fillingDegree * (131 / (volumetricLoad * ratioL_Di));

    const burningZoneLoad = kilnFiring / 1000 / kilnInternalArea;

    setResults({
      kilnInternalDiameter,
      slope,
      ratioL_Do,
      ratioL_Di,
      estimatedBurningZoneLength,
      estimatedCoatingLength,
      kilnInternalArea,
      kilnInternalFreeArea,
      volumeOfKiln,
      retentionTime,
      fillingDegree,
      volumetricLoad,
      burningZoneLoad,
    });
  };

  return (
    <div className="w-full">
      <h1 className="text-center text-[50px] pt-4 font-[500]">Kiln Calculator</h1>
      <div className="p-4 flex flex-col">
        <h2>Plant Name</h2>
        <h2>Date</h2>
        <h2>Calculations by:</h2>
      </div>
      <div className="flex md:flex-row sm:flex-col gap-2">
      <div className="p-2 flex flex-col md:w-[50%] sm:w-full gap-3">
          <TextField label="Production (tpd)" name="production" variant="outlined" onChange={handleChange} />
          <TextField label="Kiln Firing (kcal/kg cl)" name="kilnFiring" variant="outlined" onChange={handleChange} />
          <TextField label="Kiln Diameter (m)" name="kilnDiameter" variant="outlined" onChange={handleChange} />
          <TextField label="Kiln Length (m)" name="kilnLength" variant="outlined" onChange={handleChange} />
          <TextField label="Lining Thickness (mm)" name="liningThickness" variant="outlined" onChange={handleChange} />
          <TextField label="Inclination (%)" name="inclination" variant="outlined" onChange={handleChange} />
          <TextField label="Speed (rpm)" name="speed" variant="outlined" onChange={handleChange} />
          <div className="flex justify-center items-center p-2 w-full">
            <button onClick={calculateResults} className="w-[200px] p-2 h-[70px] text-[30px] rounded font-[400] border-2 border-black">
              Calculate
            </button>
          </div>
        </div>
        <div className="w-full flex flex-wrap gap-4">
          <div className="flex flex-wrap gap-2 w-full">
            
            <h3 className="md:w-[40%] sm:w-full">Kiln Internal Diameter: {results.kilnInternalDiameter?.toFixed(2)} m</h3>
            <h3 className="md:w-[40%] sm:w-full">Slope: {results.slope?.toFixed(2)}°</h3>
            <h3 className="md:w-[40%] sm:w-full">Ratio L/Do: {results.ratioL_Do?.toFixed(2)}</h3>
            <h3 className="md:w-[40%] sm:w-full">Ratio L/Di: {results.ratioL_Di?.toFixed(2)}</h3>
            <h3 className="md:w-[40%] sm:w-full">Estimated Burning Zone Length: {results.estimatedBurningZoneLength} m</h3>
            <h3 className="md:w-[40%] sm:w-full">Estimated Coating Length: {results.estimatedCoatingLength} m</h3>
            <h3 className="md:w-[40%] sm:w-full">Kiln Internal Area: {results.kilnInternalArea?.toFixed(2)} m²</h3>
            <h3 className="md:w-[40%] sm:w-full">Kiln Internal Free Area: {results.kilnInternalFreeArea?.toFixed(2)} m²</h3>
            <h3 className="md:w-[40%] sm:w-full">Volume of Kiln: {results.volumeOfKiln?.toFixed(2)} m³</h3>
            <h3 className="md:w-[40%] sm:w-full">Retention Time: {results.retentionTime?.toFixed(2)} min</h3>
            <h3 className="md:w-[40%] sm:w-full">Filling Degree: {results.fillingDegree?.toFixed(2)}%</h3>
            <h3 className="md:w-[40%] sm:w-full">Volumetric Load: {results.volumetricLoad?.toFixed(2)} tpd/m³</h3>
            <h3 className="md:w-[40%] sm:w-full">Burning Zone Load: {results.burningZoneLoad?.toFixed(2)} Gcal/h/m²</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
