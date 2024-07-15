<script lang="ts">
    import type { Patient } from "fhir/r4";
    import clsx from "clsx";
    import { fhirApi } from "./api";

    let npage = 0;

    const fetchPatients = async (page: number) => {
        const patientResponse = await fhirApi.get("/Patient", {
            params: {
                name: "LXg0zshsD7-IGB2L56Qo8",
                _sort: "-_lastUpdated",
                _count: 20,
                _offset: npage * 20,
            },
        });
        const patients = patientResponse.data;
        return patients;
    };

    const formatName = (resource: Patient) => {
        const firstNameElement = resource.name?.[0];
        const firstName = firstNameElement?.given?.join(" ");
        const lastName = firstNameElement?.family;

        if (lastName) {
            return `${firstName} ${lastName}`;
        }
        return `${firstName}`;
    };
</script>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Table with Header</title>
    <style>
        table {
            border-collapse: collapse;
        }
        th,
        td {
            border: 1px solid black;
            padding: 6px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<p class="mb-3">
    <a class="p-2 bg-black text-white" href="/patient">Create Patient</a>
</p>
<h1 class="text-3xl font-bold">Patients on the Server</h1>
<table class="min-w-full divide-y divide-gray-200">
    <tr>
        <th>ID</th>
        <th>Name</th>
        <th>DOB</th>
        <th>Gender</th>
        <th>Actions</th>
    </tr>
    {#await fetchPatients(npage)}
        <p>Loading...</p>
    {:then patients}
        {#each patients.entry as patient}
            <tr class="py-2 hover:bg-blue-200 hover:ring-blue-700 px-10">
                <td>{patient?.resource?.id}</td>
                <td>{formatName(patient?.resource)}</td>
                <td>{patient?.resource?.birthDate || ""}</td>
                <td align="left">{patient?.resource?.gender || ""}</td>
                <td>
                    <a class="text-blue-600" href={`/patient/${patient?.resource?.id}`}>
                        Edit
                    </a>
                </td>
            </tr>
        {/each}
    {:catch error}
        <p>Error: {error.message}</p>
    {/await}
</table>
<div class="mt-4">
    <button
        class={clsx("p-2 bg-black text-white", {
            "bg-black": npage != 0,
            "bg-gray-300": npage == 0,
        })}
        on:click={() => npage--}>Previous</button
    >
    <button class="p-2 bg-black text-white" on:click={() => npage++}
        >Next</button
    >
</div>
