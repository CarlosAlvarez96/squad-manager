const apiUrl = 'http://localhost';

const replacer = (key, value) => {
  if (typeof value === "number") {
    return value;
  }
  return value;
};

const get = async (endpoint) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(apiUrl + endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
  });
  console.log(response);
  if (!response.ok) {
    // throw new Error("Error en la petición GET al endpoint: " + endpoint);
    throw new Error(
      `Error en la petición GET al endpoint: ${endpoint} (${response.status} ${response.statusText})`
    );
  }
  const data = await response.json();
  return data;
};

const post = async (endpoint, dto) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto, replacer),
  });
  // console.log(JSON.stringify(dto, replacer));
  if (!response.ok) {
    throw new Error(
      `Error en la petición POST al endpoint: ${endpoint} (${response.status} ${response.statusText})`
    );
  }
  const data = await response.json();
  return data;
};

const put = async (endpoint, dto) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto, replacer),
  });
  if (!response.ok) {
    throw new Error(
      `Error en la petición POST al endpoint: ${endpoint} (${response.status} ${response.statusText})`
    );
  }
  const data = await response.json();
  return data;
};

const deleteMethod = async (endpoint) => {
  const token = sessionStorage.getItem("token");
  await fetch(`${apiUrl}${endpoint}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export { get, post, put, deleteMethod };