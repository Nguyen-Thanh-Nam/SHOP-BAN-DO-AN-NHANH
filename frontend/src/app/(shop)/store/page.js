"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin, Phone, Clock, Loader2, Navigation } from "lucide-react";
import { StoreService } from "@/services/storeService";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const MapWithNoSSR = dynamic(
    () =>
        import("react-leaflet").then((mod) => {
            const { MapContainer, TileLayer, Marker, Popup, useMap } = mod;
            const L = require("leaflet");

            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
                iconUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                shadowUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
            });

            const ChangeView = ({ center }) => {
                const map = useMap();
                map.setView(center, 14);
                return null;
            };

            return ({ center, stores, selectedId }) => (
                <MapContainer
                    center={center}
                    zoom={13}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                >
                    <ChangeView center={center} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {stores.map(
                        (store) =>
                            store.latitude &&
                            store.longitude && (
                                <Marker
                                    key={store.id}
                                    position={[
                                        parseFloat(store.latitude),
                                        parseFloat(store.longitude),
                                    ]}
                                    opacity={selectedId === store.id ? 1 : 0.7}
                                >
                                    <Popup>
                                        <div className="text-sm font-bold text-[#f48120]">
                                            {store.name}
                                        </div>
                                        <div className="text-xs">
                                            {store.address}
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                    )}
                </MapContainer>
            );
        }),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                Đang tải bản đồ...
            </div>
        ),
    }
);

const StorePage = () => {
    const router = useRouter();

    const [stores, setStores] = useState([]);
    const [filteredStores, setFilteredStores] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedStore, setSelectedStore] = useState(null);
    const [mapCenter, setMapCenter] = useState([21.0285, 105.8542]);
    const [userLocation, setUserLocation] = useState(null);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
                Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (err) => console.log("Không lấy được vị trí", err)
            );
        }
    }, []);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const res = await StoreService.getAll();
                const data = res.data || [];
                setStores(data);

                if (data.length > 0) {
                    setFilteredStores(data);
                    const firstStore = data[0];
                    setSelectedStore(firstStore);
                    if (firstStore.latitude && firstStore.longitude) {
                        setMapCenter([
                            parseFloat(firstStore.latitude),
                            parseFloat(firstStore.longitude),
                        ]);
                    }
                }
            } catch (error) {
                console.error("Lỗi tải cửa hàng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStores();
    }, []);

    useEffect(() => {
        if (stores.length > 0 && userLocation) {
            const updatedStores = stores.map((store) => ({
                ...store,
                distance: calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    parseFloat(store.latitude),
                    parseFloat(store.longitude)
                ),
            }));

            updatedStores.sort((a, b) => {
                if (!a.distance) return 1;
                if (!b.distance) return -1;
                return a.distance - b.distance;
            });

            setFilteredStores(updatedStores);

            if (updatedStores.length > 0) {
                const nearestStore = updatedStores[0];
                setSelectedStore(nearestStore);
                if (nearestStore.latitude && nearestStore.longitude) {
                    setMapCenter([
                        parseFloat(nearestStore.latitude),
                        parseFloat(nearestStore.longitude),
                    ]);
                }
            }
        }
    }, [userLocation]);

    const handleSelectStore = (store) => {
        setSelectedStore(store);
        if (store.latitude && store.longitude) {
            setMapCenter([
                parseFloat(store.latitude),
                parseFloat(store.longitude),
            ]);
        }
    };

    const formatTime = (time) => (time ? time.slice(0, 5) : "...");

    return (
        <div className="bg-white font-sans flex-1 flex flex-col h-[calc(100vh-140px)]">
            <div className="w-full px-8 py-6 flex-1 flex flex-col">
                <div className="flex flex-col lg:flex-row flex-1 gap-6">
                    <div className="w-full lg:w-2/3 h-[400px] lg:h-full relative rounded-xl overflow-hidden border border-gray-200 shadow-sm order-2 lg:order-1">
                        <MapWithNoSSR
                            center={mapCenter}
                            stores={filteredStores}
                            selectedId={selectedStore?.id}
                        />
                    </div>

                    <div className="w-full lg:w-1/3 flex flex-col order-1 lg:order-2 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-gray-100 shadow-sm shrink-0">
                            <h2 className="text-xs font-bold text-gray-600 uppercase mb-1">
                                CHUỖI GÀ RÁN CRISPC
                            </h2>
                            <div className="flex items-center text-[#009895] font-bold text-lg">
                                <span className="mr-1">Hotline:</span>
                                <span>19000000</span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="animate-spin text-[#f48120]" />
                            </div>
                        ) : (
                            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-4">
                                {filteredStores.map((store) => (
                                    <div
                                        key={store.id}
                                        onClick={() => handleSelectStore(store)}
                                        className={`p-4 border rounded-xl transition-all cursor-pointer ${
                                            selectedStore?.id === store.id
                                                ? "border-[#f48120] bg-orange-50/30"
                                                : "border-gray-100 hover:border-gray-200"
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-[#f48120] text-sm uppercase">
                                                {store.name}
                                                {store.distance !== undefined &&
                                                    store.distance !== null && (
                                                        <span className="ml-1 text-gray-400 font-normal normal-case text-xs">
                                                            cách{" "}
                                                            {store.distance < 1
                                                                ? Math.round(
                                                                      store.distance *
                                                                          1000
                                                                  ) + "m"
                                                                : store.distance.toFixed(
                                                                      1
                                                                  ) + "km"}
                                                        </span>
                                                    )}
                                            </h3>
                                        </div>

                                        <div className="text-xs text-gray-600 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Clock
                                                    size={14}
                                                    className="text-green-600 shrink-0"
                                                />
                                                <span className="font-medium">
                                                    {formatTime(
                                                        store.open_time
                                                    )}{" "}
                                                    -{" "}
                                                    {formatTime(
                                                        store.close_time
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <MapPin
                                                    size={14}
                                                    className="text-gray-400 shrink-0 mt-0.5"
                                                />
                                                <span className="line-clamp-2">
                                                    {store.address}
                                                </span>
                                            </div>
                                            {store.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone
                                                        size={14}
                                                        className="text-blue-500 shrink-0"
                                                    />
                                                    <span>{store.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StorePage;
