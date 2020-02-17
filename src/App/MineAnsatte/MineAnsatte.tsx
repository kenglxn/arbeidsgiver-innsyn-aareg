import React, { useEffect, useState } from 'react';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Lenke from 'nav-frontend-lenker';
import { Organisasjon } from '../Objekter/OrganisasjonFraAltinn';
import { Arbeidstaker } from '../Objekter/Arbeidstaker';
import { Arbeidsforhold } from '../Objekter/ArbeidsForhold';
import { byggListeBasertPaPArametere, sorterArbeidsforhold } from './sorteringOgFiltreringsFunksjoner';
import {
    regnUtantallSider,
    regnUtArbeidsForholdSomSkalVisesPaEnSide,
    visEllerSkjulChevroner
} from './pagineringsFunksjoner';
import SideBytter from './SideBytter/SideBytter';
import ListeMedAnsatteForMobil from './ListeMineAnsatteForMobil/ListeMineAnsatteForMobil';
import TabellMineAnsatte from './TabellMineAnsatte/TabellMineAnsatte';
import { hentArbeidsforholdFraAAreg } from '../../api/AaregApi';
import { linkTilMinSideArbeidsgiver } from '../lenker';
import MineAnsatteTopp from './MineAnsatteTopp/MineAnsatteTopp';
import './MineAnsatte.less';

interface MineAnsatteProps {
    setValgtArbeidstaker: (arbeidstaker: Arbeidstaker) => void;
    valgtOrganisasjon: Organisasjon;
}

export enum SorteringsAttributt {
    NAVN,
    FNR,
    YRKE,
    STARTDATO,
    SLUTTDATO,
    VARSEL,
    PERMITTERINGSPROSENT,
    STILLINGSPROSENT
}

export interface KolonneState {
    erValgt: boolean;
    sorteringsAttributt: SorteringsAttributt;
    reversSortering: boolean;
}

const initialKolonne: KolonneState = {
    erValgt: true,
    sorteringsAttributt: SorteringsAttributt.NAVN,
    reversSortering: false
};

const MineAnsatte = (props: MineAnsatteProps) => {
    const [naVarendeSidetall, setnaVarendeSidetall] = useState<number>(1);
    const [listeMedArbeidsForhold, setListeMedArbeidsForhold] = useState(Array<Arbeidsforhold>());
    const [navarendeKolonne, setNavarendeKolonne] = useState(initialKolonne);
    const [filtrerPaAktiveAvsluttede, setFiltrerPaAktiveAvsluttede] = useState('Alle');
    const [soketekst, setSoketekst] = useState<string>('');
    const [listeFraAareg, setListeFraAareg] = useState(Array<Arbeidsforhold>());
    const [skalFiltrerePaVarsler, setSkalFiltrerePaVarsler] = useState<boolean>(false);
    const [ferdiglastet, setFerdiglastet] = useState<boolean>(false);

    const arbeidsforholdPerSide = 25;

    const setIndeksOgGenererListe = (indeks: number) => {
        setnaVarendeSidetall(indeks);
    };

    useEffect(() => {
        setFerdiglastet(false);
        const hentogSettArbeidsforhold = async () => {
            return await hentArbeidsforholdFraAAreg(
                props.valgtOrganisasjon.OrganizationNumber,
                props.valgtOrganisasjon.ParentOrganizationNumber
            );
        };

        if (
            props.valgtOrganisasjon.OrganizationNumber !== '' &&
            props.valgtOrganisasjon.ParentOrganizationNumber !== ''
        ) {
            hentogSettArbeidsforhold().then(responsAareg => {
                setListeFraAareg(responsAareg.arbeidsforholdoversikter);
                setFerdiglastet(true);
            });
        }
    }, [props.valgtOrganisasjon]);

    useEffect(() => {
        const oppdatertListe = byggListeBasertPaPArametere(
            listeFraAareg,
            filtrerPaAktiveAvsluttede,
            skalFiltrerePaVarsler,
            soketekst
        );
        setListeMedArbeidsForhold(oppdatertListe);
        setnaVarendeSidetall(1);
    }, [listeFraAareg, soketekst, navarendeKolonne, filtrerPaAktiveAvsluttede, skalFiltrerePaVarsler]);

    const antallSider = regnUtantallSider(arbeidsforholdPerSide, listeMedArbeidsForhold.length);

    let forholdPaEnSide: Arbeidsforhold[] = [];
    if (navarendeKolonne.reversSortering) {
        forholdPaEnSide = regnUtArbeidsForholdSomSkalVisesPaEnSide(
            naVarendeSidetall,
            arbeidsforholdPerSide,
            antallSider,
            sorterArbeidsforhold(listeMedArbeidsForhold, navarendeKolonne.sorteringsAttributt).reverse()
        );
    } else {
        forholdPaEnSide = regnUtArbeidsForholdSomSkalVisesPaEnSide(
            naVarendeSidetall,
            arbeidsforholdPerSide,
            antallSider,
            sorterArbeidsforhold(listeMedArbeidsForhold, navarendeKolonne.sorteringsAttributt)
        );
    }

    const antallVarsler = listeMedArbeidsForhold.filter(forhold => {
        return forhold.varsler;
    }).length;

    useEffect(() => {
        visEllerSkjulChevroner(
            naVarendeSidetall,
            antallSider,
            'sidebytter-chevron-venstre',
            'sidebytter-chevron-hoyre'
        );
    }, [antallSider, naVarendeSidetall]);

    return (
        <div className="bakgrunnsside">
            <div className="innhold-container">
                <Normaltekst className="brodsmule">
                    <Lenke href={linkTilMinSideArbeidsgiver(props.valgtOrganisasjon.OrganizationNumber)}>
                        Min side – arbeidsgiver
                    </Lenke>
                    {' / arbeidsforhold'}
                </Normaltekst>
                <div className="mine-ansatte">
                    <Systemtittel className="mine-ansatte__systemtittel" tabIndex={0}>
                        Opplysninger fra Aa-registeret
                    </Systemtittel>
                    <MineAnsatteTopp
                        valgtOrganisasjon={props.valgtOrganisasjon}
                        setIndeksOgGenererListe={setIndeksOgGenererListe}
                        setSoketekst={setSoketekst}
                        antallSider={antallSider}
                        antallVarsler={antallVarsler}
                        lengdeResponsFiltrertListe={listeMedArbeidsForhold.length}
                        listeMedArbeidsforhold={listeMedArbeidsForhold}
                        naVarendeSidetall={naVarendeSidetall}
                        responsFraAaregisteret={listeFraAareg}
                        soketekst={soketekst}
                        setSkalFiltrerePaVarsler={setSkalFiltrerePaVarsler}
                        skalFiltrerePaVarsler={skalFiltrerePaVarsler}
                        setFiltrerPaAktiveAvsluttede={setFiltrerPaAktiveAvsluttede}
                    />
                    {!ferdiglastet && (
                        <div className="mine-ansatte__spinner-container">
                            {' '}
                            Henter arbeidsforhold
                            <NavFrontendSpinner className="mine-ansatte__spinner" />
                        </div>
                    )}
                    {ferdiglastet && listeMedArbeidsForhold.length > 0 && (
                        <>
                            {' '}
                            <TabellMineAnsatte
                                className="mine-ansatte__table"
                                listeMedArbeidsForhold={forholdPaEnSide}
                                setNavarendeKolonne={setNavarendeKolonne}
                                byttSide={setIndeksOgGenererListe}
                                navarendeKolonne={navarendeKolonne}
                                settValgtArbeidsgiver={props.setValgtArbeidstaker}
                                valgtBedrift={props.valgtOrganisasjon.OrganizationNumber}
                            />
                            <ListeMedAnsatteForMobil
                                listeMedArbeidsForhold={forholdPaEnSide}
                                className="mine-ansatte__liste"
                                settValgtArbeidsgiver={props.setValgtArbeidstaker}
                                valgtBedrift={props.valgtOrganisasjon.OrganizationNumber}
                            />
                        </>
                    )}
                    {antallSider > 1 && (
                        <SideBytter
                            plassering="nederst"
                            className="nedre-sidebytter"
                            byttSide={setIndeksOgGenererListe}
                            antallSider={antallSider}
                            naVarendeSidetall={naVarendeSidetall}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MineAnsatte;
