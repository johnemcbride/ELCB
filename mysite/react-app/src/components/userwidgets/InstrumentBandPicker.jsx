import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import FormControl from "@mui/material/FormControl";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

export default function InstrumentBandPicker({ bandOptions, instrumentsPlayed, setInstrumentsPlayed }) {
    console.log('In instrument picker, band options:')
    console.log(bandOptions)
    const handleChange = (event) => {
        const selectedBand = event.target.name;
        const selectedInstrument = event.target.value;
        const newInstruments = [];
        let found = false;
        for (const instrument of instrumentsPlayed || []) {
            if (instrument.Band === selectedBand) {
                found = true;
                if (selectedInstrument !== "Not Attending") {
                    newInstruments.push({
                        Band: selectedBand,
                        Instrument: selectedInstrument,
                    });
                }
            } else {
                newInstruments.push(instrument);
            }
        }
        if (!found) {
            newInstruments.push({
                Band: selectedBand,
                Instrument: selectedInstrument,
            });
        }
        setInstrumentsPlayed(newInstruments);
    }

    return (
        <Box component="form" sx={{ mt: 1 }}>
            <Grid spacing={2} container>
                <Grid item xs={12}>
                    <Typography>
                        {bandOptions?.features ?
                            'To help us run things smoothly, for each band you are attending this term, please specify which instrument you are playing.' :
                            'You are not attending any bands.  Click next to continue.'}
                    </Typography>

                    {bandOptions?.features?.options.map((band) => {
                        console.log(
                            "getting options out of band collection:" +
                            JSON.stringify(band)
                        );
                        return (
                            <FormControl key={band} sx={{ mt: 3, mb: 1 }} fullWidth>
                                <InputLabel id="instruments">{band.description}</InputLabel>

                                <Select
                                    label={band.description}
                                    component="Select"
                                    name={band.description}
                                    fullWidth
                                    id={band.description}
                                    value={
                                        instrumentsPlayed?.filter(
                                            (instrument) => instrument.Band === band.description
                                        )[0]?.Instrument || "Not Attending"
                                    }
                                    // You need to set the new field value
                                    onChange={handleChange}
                                    multiple={false}
                                >
                                    {band.instruments.map((s) => (
                                        <MenuItem fullWidth key={s} value={s}>
                                            {s}
                                        </MenuItem>
                                    ))}
                                    <MenuItem
                                        fullWidth
                                        key={"Not Attending"}
                                        value={"Not Attending"}
                                    >
                                        {"Not Attending"}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        );
                    })}
                </Grid>
            </Grid>
        </Box>)
}