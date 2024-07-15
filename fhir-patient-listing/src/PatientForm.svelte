<script lang="ts">
    import type { Patient } from "fhir/r4";
    import { fhirApi } from "./api";

    export let id: string = "";

    const dateToday = new Date().toISOString().split("T")[0];

    let messageString: any | undefined = undefined
    let loading = false

    const handleSubmit = async (e: SubmitEvent) => {
        loading = true
        e.preventDefault();
        console.log({firstName, lastName, patientGender, birthDate, phoneNumber})

        // TODO: Add Logic to create FHIR Resource,
        // and POST it to FHIR server
        // Show success/ failure message
        let fhirResource: Patient = {
            resourceType:"Patient"
        }
        fhirResource.name = [{
            "given":[firstName],
            "family":lastName,
            "use":"usual",
            "text": "LXg0zshsD7-IGB2L56Qo8"
        }]
        fhirResource.birthDate = birthDate
        fhirResource.gender = patientGender
        

        if(phoneNumber){
            fhirResource.telecom = [{
                system: "phone",
                value: phoneNumber
            }]
        }
        try {
            const response = await fhirApi.post('/Patient',fhirResource)          
        } catch (e: any) {
            const errorData = e.response.data
            messageString = errorData
        }
        loading = false;
    }

    let firstName: string
    let lastName: string | undefined
    let patientGender: "male" | "female" | "other" | "unknown" | undefined = undefined
    let birthDate: string
    let phoneNumber: string
</script>

<h1 class="text-2xl font-semibold mb-5">
    {#if id}
        Updating Patient: {id}
    {:else}
        Create Patient
    {/if}
</h1>

<form class="space-y-10" on:submit={handleSubmit}>
    <div class="space-y-5">
        <div>
            <label for="first_name"class="font-semibold block" >First Name</label>
            <input bind:value={firstName} id="first_name" class="border p-2 w-full" required/>
            
        </div>
        <div>
            <label for="last_name"class="font-semibold block">Last Name</label>
            <input bind:value={lastName} id="last_name" class="border p-2"/>
        </div>
        <div>
            <label for="gender"class="font-semibold block">Gender</label>
            <select bind:value={patientGender} id="gender" class="border p-2" required >
                <option value={undefined} disabled>Please Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                
            </select>
        </div>
        <div>
            <label for="dob"class="font-semibold block">Date of Birth</label>
            <input bind:value={birthDate} id="dob" class="border p-2" type="date" max={dateToday} required/>
        </div>
        <div>
            <label for="phone"class="font-semibold block">Phone Number</label>
            <input bind:value={phoneNumber} id="first_name" class="border p-2" type="tel" required/>
        </div>
    </div>

    <div>
        <button class="p-2 bg-orange-600 hover:bg-black rounded-md text-white"> 
            {#if loading}
                Loading ...
            {:else}
                Submit
            {/if}
        </button>
    </div>
</form>

{#if messageString}
    <pre>
        Status:
        {JSON.stringify(messageString)}
    </pre>
{/if}
