import api from "./axios";

export async function loadTours(){
    const res = await api.get("/api/tours");
    return res.data;
}

export async function loadTour(tourID){
    const res =  await api.get(`/api/tours/${tourID}`);
    return res.data;
}