<script lang="ts">
    import type { Patient } from "fhir/r4";
    import { fhirApi } from "./api";
    import { navigate } from "svelte-routing";

    export let id: string = "";

    const dateToday = new Date().toISOString().split("T")[0];

    let messageString: any | undefined = undefined;
    let loading = false;
    let patientResource: Patient

    let patientLoading = false

    const handleSubmit = async (e: SubmitEvent) => {
        loading = true;
        e.preventDefault();

        let fhirResource: Patient = {
            resourceType: "Patient",
        };
        fhirResource.name = [
            {
                "given": [firstName],
                "family": lastName,
                "use": "usual",
                "text": "LXg0zshsD7-IGB2L56Qo8",
            },
        ];
        fhirResource.birthDate = birthDate;
        if (patientGender) {
            fhirResource.gender = patientGender;
        }

        if (phoneNumber) {
            fhirResource.telecom = [
                {
                    system: "phone",
                    value: phoneNumber,
                },
            ];
        }
        try{
            if (id) {
                messageString = await updatePatient(id, fhirResource, patientResource)
            } else {
                messageString = await createPatient(fhirResource)
            }
            navigate('/')
        } catch(e: any){
            messageString = e?.response?.data
        }


        loading = false;
    };

    const createPatient = async (resource: Patient): Promise<any> => {
        const response = await fhirApi.post("/Patient", resource);
        return response.data;
    };

    const updatePatient = async (id: string, resource: Patient, oldResource: Patient): Promise<any> =>{
        const response = await fhirApi.put(`/Patient/${id}`,{...oldResource, ...resource})
        return response.data;
    }

    const loadPatient = async (id:string) => {
        const patientResponse = await fhirApi.get<Patient>(`/Patient/${id}`)
        const patientResource = patientResponse.data
        
        const name = patientResource.name?.[0]
        firstName = name?.given?.[0]
        lastName = name?.family

        birthDate = patientResource.birthDate

        if (patientResource.gender) {
            patientGender = patientResource.gender
        }

        const phoneContactPoint = patientResource.telecom?.find(a=>a.system == 'phone')
        if(phoneContactPoint){
            phoneNumber = phoneContactPoint.value
        }
        return patientResource
    }

    let firstName: string | undefined 
    let lastName: string | undefined
    let patientGender: "male" | "female" | "other" | "unknown" | undefined = undefined;
    let birthDate: string | undefined
    let phoneNumber: string | undefined

    $: if (id) {
        patientLoading = true
        loadPatient(id).then(resource => {
        patientResource = resource
        patientLoading = false
       }) 
    }

</script>

<h1 class="text-2xl font-semibold mb-5">
    {#if id}
        Updating Patient: {id}
    {:else}
        Create Patient
    {/if}
</h1>
{#if patientLoading}
    Loading...
{:else}
<form class="space-y-10" on:submit={handleSubmit}>
    <div class="space-y-5">
        <div>
            <label for="first_name" class="font-semibold block"
                >First Name</label
            >
            <input
                bind:value={firstName}
                id="first_name"
                class="border p-2 w-full"
                required
            />
        </div>
        <div>
            <label for="last_name" class="font-semibold block">Last Name</label>
            <input
                bind:value={lastName}
                id="last_name"
                class="border p-2 w-full"
            />
        </div>
        <div>
            <label for="gender" class="font-semibold block">Gender</label>
            <select
                bind:value={patientGender}
                id="gender"
                class="border p-2 w-full"
                required
            >
                <option value={undefined} disabled>Please Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
        </div>
        <div>
            <label for="dob" class="font-semibold block">Date of Birth</label>
            <input
                bind:value={birthDate}
                id="dob"
                class="border p-2 w-full"
                type="date"
                max={dateToday}
                required
            />
        </div>
        <div>
            <label for="phone" class="font-semibold block">Phone Number</label>
            <input
                bind:value={phoneNumber}
                id="first_name"
                class="border p-2 w-full"
                type="tel"
                required
            />
        </div>
    </div>

    <div>
        <button class="p-2 bg-orange-600 hover:bg-black rounded-md text-white">
            {#if loading}
                Loading ...
            {:else if id}
                Update
            {:else}
                Create
            {/if}
        </button>
    </div>
</form>
{/if}


{#if messageString}
    <pre>
        Status:
        {JSON.stringify(messageString)}
    </pre>
{/if}
