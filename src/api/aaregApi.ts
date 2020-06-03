import {hentAntallArbeidsforholdLink, hentArbeidsforholdLink, sjekkSonekryssingLink} from '../App/lenker';
import { ObjektFraAAregisteret } from '../App/Objekter/ObjektFraAAreg';
import amplitude from '../utils/amplitude';
import {
    loggAntallAnsatte, loggBedriftsInfo,
    loggSnittTidPerArbeidsforhold,
    loggTidForAlleArbeidsforhold
} from '../App/amplitudefunksjonerForLogging';
import { FetchError } from './api-utils';
import { OversiktOverAntallForholdPerUnderenhet } from '../App/Objekter/OversiktOverAntallForholdPerUnderenhet';
import environment from "../utils/environment";

export async function hentArbeidsforholdFraAAreg(underenhet: string, enhet: string, signal: any, tilgangTiLOpplysningspliktigOrg: boolean): Promise<ObjektFraAAregisteret> {
    const headere = new Headers();
    headere.set('orgnr', underenhet);
    headere.set('jurenhet', enhet);
    const startTtid = new Date();
    let response: Response = await fetch(hentArbeidsforholdLink(), { headers: headere, signal: signal });

    if (response.ok) {
        const jsonRespons: ObjektFraAAregisteret = await response.json();
        loggAntallAnsatte(jsonRespons.arbeidsforholdoversikter.length);
        const tid = new Date().getDate() - startTtid.getDate();
        loggSnittTidPerArbeidsforhold(jsonRespons.arbeidsforholdoversikter.length, tid);
        loggTidForAlleArbeidsforhold(tid);
        amplitude.logEvent('#arbeidsforhold klarte å hente ut arbeidsforhold. Tilgang til opplysningspliktig enhet: ' + tilgangTiLOpplysningspliktigOrg);
        return jsonRespons;
    } else {
        amplitude.logEvent('#arbeidsforhold klarte ikke hente ut arbeidsforhold. Tilgang til opplysningspliktig enhet: ' + tilgangTiLOpplysningspliktigOrg);
        amplitude.logEvent('#arbeidsforhold feilet med: '+ response.statusText || response.type, response);
        if (environment.MILJO === 'prod-sbs') {
            loggBedriftsInfo(underenhet, enhet);
        }

        throw new FetchError(response.statusText || response.type, response);
    }
}

export async function hentAntallArbeidsforholdFraAareg(underenhet: string, enhet: string, signal: any): Promise<Number> {
    const headere = new Headers();
    headere.set('opplysningspliktig', enhet);
    headere.set('orgnr', underenhet);
    let respons = await fetch(hentAntallArbeidsforholdLink(), { headers: headere, signal: signal  });

    if (respons.ok) {
        const jsonRespons: OversiktOverAntallForholdPerUnderenhet = await respons.json();
        const valgtunderEnhet = jsonRespons.filter(
            oversikt => oversikt.arbeidsgiver.organisasjonsnummer === underenhet
        );
        if (valgtunderEnhet[0]) {
            return valgtunderEnhet[0].aktiveArbeidsforhold + valgtunderEnhet[0].inaktiveArbeidsforhold;
        }
        return 0;
    } else {
        throw new FetchError(respons.statusText || respons.type, respons);
    }
}

export async function sjekkSonekryssing(): Promise<string> {
    //console.log("sjekk sonekrysningslink: ", sjekkSonekryssingLink());
    let respons = await fetch(sjekkSonekryssingLink() );
    if (respons.ok) {
        return respons.json();
    }
    else {
        return '';
    }
}
