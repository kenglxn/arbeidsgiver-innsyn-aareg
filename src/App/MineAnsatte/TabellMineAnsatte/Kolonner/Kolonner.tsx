import React from 'react';
import Kolonne from './Kolonne/Kolonne';
import { KolonneState, SorteringsAttributt } from '../../MineAnsatte';

interface Props {
    navarendeKolonne: KolonneState;
    setNavarendeKolonne: (kolonne: KolonneState) => void;
}

const KolonnerFullSkjerm = (props: Props) => {
    return (
        <thead>
            <tr>
                <Kolonne
                    setNavarendeKolonne={props.setNavarendeKolonne}
                    label="Navn"
                    attributt={SorteringsAttributt.NAVN}
                    navarendeKolonne={props.navarendeKolonne}
                />
                <Kolonne
                    setNavarendeKolonne={props.setNavarendeKolonne}
                    label="Fødselsnummer"
                    attributt={SorteringsAttributt.FNR}
                    navarendeKolonne={props.navarendeKolonne}
                />
                <Kolonne
                    setNavarendeKolonne={props.setNavarendeKolonne}
                    label="Startdato"
                    attributt={SorteringsAttributt.STARTDATO}
                    navarendeKolonne={props.navarendeKolonne}
                />
                <Kolonne
                    setNavarendeKolonne={props.setNavarendeKolonne}
                    label="Sluttdato"
                    attributt={SorteringsAttributt.SLUTTDATO}
                    navarendeKolonne={props.navarendeKolonne}
                />
                <Kolonne
                    setNavarendeKolonne={props.setNavarendeKolonne}
                    label="Stilling %"
                    attributt={SorteringsAttributt.STILLINGSPROSENT}
                    navarendeKolonne={props.navarendeKolonne}
                />
                <Kolonne
                    setNavarendeKolonne={props.setNavarendeKolonne}
                    label="Yrke"
                    attributt={SorteringsAttributt.YRKE}
                    navarendeKolonne={props.navarendeKolonne}
                />
                <Kolonne
                    setNavarendeKolonne={props.setNavarendeKolonne}
                    label="Varsling"
                    attributt={SorteringsAttributt.VARSEL}
                    navarendeKolonne={props.navarendeKolonne}
                />
            </tr>
        </thead>
    );
};

export default KolonnerFullSkjerm;
