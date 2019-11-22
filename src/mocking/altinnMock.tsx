import fetchMock from 'fetch-mock';
/*const delay = new Promise(res => setTimeout(res, 500));

fetchMock
    .get(
        'min-side-arbeidsgiver/api/organisasjoner',
        delay.then(() => {
            return OrganisasjonerResponse;
        })
    )
    .spy();

//const tomOrganisasjonerResponse = [{}];

 */
export const OrganisasjonerResponse = [
    {
        Name: 'BALLSTAD OG HAMARØY',
        Type: 'Business',
        OrganizationNumber: '811076732',
        ParentOrganizationNumber: '811076112',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'BALLSTAD OG HORTEN',
        Type: 'Enterprise',
        ParentOrganizationNumber: null,
        OrganizationNumber: '811076112',
        OrganizationForm: 'AS',
        Status: 'Active',
    },
    {
        Name: 'DIGITAL JUNKIES AS ',
        Type: 'Enterprise',
        OrganizationNumber: '822565212',
        ParentOrganizationNumber: null,
        OrganizationForm: 'AS',
        Status: 'Active',
    },
    {
        Name: 'DIGITAL JUNKIES AS ',
        Type: 'Business',
        OrganizationNumber: '922658986',
        ParentOrganizationNumber: '822565212',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'NAV ENGERDAL',
        Type: 'Business',
        ParentOrganizationNumber: '874652202',
        OrganizationNumber: '991378642',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
    {
        Name: 'NAV HAMAR',
        Type: 'Business',
        ParentOrganizationNumber: '874652202',
        OrganizationNumber: '990229023',
        OrganizationForm: 'BEDR',
        Status: 'Active',
    },
];