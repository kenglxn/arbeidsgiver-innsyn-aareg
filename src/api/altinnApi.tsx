import {Organisasjon} from "@navikt/bedriftsmeny/lib/Organisasjon";

export async function hentOrganisasjonerFraAltinn(): Promise<Organisasjon[]> {
    let respons = await fetch('/bedriftsoversikt-og-ansatte/api/organisasjoner');
    if (respons.ok) {
        return await respons.json();
    } else {
        return [];
    }
};