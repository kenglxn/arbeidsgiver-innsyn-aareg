import React from 'react';
import './VelgTidligereVirksomhet.less';
import {Organisasjon, tomaAltinnOrganisasjon} from "../../Objekter/OrganisasjonFraAltinn";
import {Select} from "nav-frontend-skjema";
import {RouteComponentProps, withRouter} from "react-router";

interface Props extends RouteComponentProps {
  tidligereOrganisasjoner?: Organisasjon[];
  setTidligereVirksomhet: (virksomhet: Organisasjon) => void;
  tidligereVirksomhet?: Organisasjon;
  redirectTilbake: () => void;
}

const VelgTidligereVirksomhet = ({ tidligereOrganisasjoner, setTidligereVirksomhet, tidligereVirksomhet, redirectTilbake}: Props) => {
    const objekter = tidligereOrganisasjoner && tidligereOrganisasjoner.map((virksomhet) => {
    return <option id={'tidligere-virksomhet'} value={virksomhet.OrganizationNumber} key={virksomhet.OrganizationNumber}
    >{virksomhet.Name}</option>
  })

  const currentUrl = new URL(window.location.href);
  const parameterForTidligereVirksomhet = currentUrl.searchParams.get('tidligereVirksomhet');

    if (tidligereVirksomhet === tomaAltinnOrganisasjon && tidligereOrganisasjoner){
      if (parameterForTidligereVirksomhet) {
        const organisasjon = tidligereOrganisasjoner.filter(organisasjon => organisasjon.OrganizationNumber === parameterForTidligereVirksomhet);
        if (organisasjon.length) {
          setTidligereVirksomhet(organisasjon[0]);
        }
        else {
          setTidligereVirksomhet(tidligereOrganisasjoner[0]);
        }
      }
      else {
        setTidligereVirksomhet(tidligereOrganisasjoner[0]);
      }
  }

  return (
      <div className={'mine-ansatte__velg-tidligere-virksomhet'}>
        <Select placeholder={'Velg tidligere virksomhet'} onChange={event => {
          const fullVirksomhet = tidligereOrganisasjoner?.filter(virksomhet => {
            return virksomhet.OrganizationNumber === event.target.value;
          })[0]
          setTidligereVirksomhet(fullVirksomhet!!);
        }} id = {'velg-tidligere-virksomhet' }  >
          {objekter}
        </Select>
      </div>
  );
};

export default withRouter(VelgTidligereVirksomhet);