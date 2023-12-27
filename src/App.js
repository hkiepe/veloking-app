import React, { useState, useEffect, useCallback } from "react";

import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "./firebase-config";
import {
  collection,
  onSnapshot,
  updateDoc,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";

import { Modal, Layout, Row, Col, Card, Tag } from "antd";
import { ToolTwoTone, DashboardTwoTone } from "@ant-design/icons";
//import "antd/dist/antd.css";
import "antd/dist/antd.min.css";
import ChangeVehicles from "./components/Rentals/ChangeVehicles/ChangeVehicles";
import { fetchAvailableRentalpoints } from "./components/helperFunctions/http";

import MainHeader from "./components/MainHeader/MainHeader";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import MainFooter from "./components/MainFooter/MainFooter";

function App() {
  const [loggedInUser, setLoggedInUser] = useState({});
  const [rentalsList, setRentalsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rentalpoint, setRentalpoint] = useState("");
  const [rentalpoints, setRentalpoints] = useState("");
  const [vehicles, setVehicles] = useState("");
  const [prices, setPrices] = useState("");
  const [rentalData, setRentalData] = useState("");
  const [isChangeVehicleVisible, setIsChangeVehicleVisible] = useState("");
  const [userPersonalInfo, setUserPersonalInfo] = useState({});

  const { Content } = Layout;

  const rentalsCollectionRef = useCallback(collection(db, "rentals"), [db]);
  const rentalpointsCollectionRef = useCallback(
    collection(db, "rentalpoints"),
    [db]
  );
  const vehiclesCollectionRef = useCallback(collection(db, "vehicles"), [db]);
  const pricesCollectionRef = useCallback(collection(db, "prices"), [db]);

  onAuthStateChanged(auth, (user) => {
    try {
      onSnapshot(doc(db, "users", user.uid), (doc) => {
        setRentalpoint(doc.data().rentalpoint);
      });
    } catch (error) {
      setError(error.message);
    }

    setLoggedInUser(user);
  });

  const getRentals = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getDocs(rentalsCollectionRef);
      if (!response) {
        throw new Error("Something went wrong");
      }
      const data = response.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setRentalsList(data);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [rentalsCollectionRef]);

  const getRentalpoints = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getDocs(rentalpointsCollectionRef);
      if (!response) {
        throw new Error("Something went wrong");
      }
      const data = response.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log("rentalpoints", data);
      setRentalpoints(data);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [rentalpointsCollectionRef]);

  const getVehicles = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getDocs(vehiclesCollectionRef);
      if (!response) {
        throw new Error("Something went wrong");
      }
      const data = response.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setVehicles(data);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [vehiclesCollectionRef]);

  const getPrices = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getDocs(pricesCollectionRef);
      if (!response) {
        throw new Error("Something went wrong");
      }
      const data = response.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setPrices(data);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [pricesCollectionRef]);

  const addRentalHandler = useCallback(
    async (rental) => {
      const startRentalTime = new Date();
      rental.payments[0].paymentTimestamp = startRentalTime.toISOString();
      rental.payments[0].amount = parseInt(rental.payments[0].amount);
      rental.vehicles = rental.vehicles.map((vehicle) => {
        return {
          vehicleid: vehicle,
          startDateTime: startRentalTime.toISOString(),
        };
      });
      try {
        await addDoc(rentalsCollectionRef, {
          ...rental,
          rentalpoint,
          startRentalTime: startRentalTime.toISOString(),
          rented: true,
        });
        const response = await getDocs(vehiclesCollectionRef);
        if (!response) {
          throw new Error("Something went wrong");
        }
        response.docs.forEach((item) => {
          rental.vehicles.forEach(async (vehicle) => {
            if (vehicle.vehicleid === item.data().vehicleid) {
              await updateDoc(doc(db, "vehicles", item.id), { rented: true });
            }
          });
        });
      } catch (error) {
        setError(error.message);
      }
      getRentals();
      getVehicles();
    },
    [
      rentalsCollectionRef,
      vehiclesCollectionRef,
      rentalpoint,
      getRentals,
      getVehicles,
    ]
  );

  const getUserPersonalInfo = useCallback(async () => {
    try {
      if (loggedInUser && loggedInUser.uid != null) {
        const userDoc = await getDoc(doc(db, "users", loggedInUser.uid));
        setUserPersonalInfo(userDoc.data());
      }
    } catch (error) {
      setError(error.message);
    }
  }, [loggedInUser]);

  useEffect(() => {
    async function fetchRentalpoints() {
      setIsLoading(true);
      try {
        const rentalpoints = await fetchAvailableRentalpoints();
        console.log("Rentalpoints", rentalpoints);
        // setRentalpoints(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        console.log("error", error.message);
        setIsLoading(false);
      }
    }
    // fetchRentalpoints();
    getUserPersonalInfo();
    getRentalpoints();
    getRentals();
    getVehicles();
    getPrices();
  }, [
    addRentalHandler,
    getPrices,
    getVehicles,
    getRentalpoints,
    getRentals,
    getUserPersonalInfo,
  ]);

  const deleteRentalHandler = async (id, rentedVehicles) => {
    try {
      const rentalDoc = doc(db, "rentals", id);
      await deleteDoc(rentalDoc);
      const response = await getDocs(vehiclesCollectionRef);
      if (!response) {
        throw new Error("Something went wrong");
      }
      response.docs.forEach((item) => {
        rentedVehicles.forEach(async (vehicle) => {
          if (vehicle.vehicleid === item.data().vehicleid) {
            await updateDoc(doc(db, "vehicles", item.id), { rented: false });
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
    getRentals();
    getVehicles();
  };

  const changeVehiclesHandler = async (id) => {
    try {
      const rentalDoc = await getDoc(doc(db, "rentals", id));
      if (rentalDoc.exists()) {
        setRentalData({ ...rentalDoc.data(), rentalId: id });
        showChangeVehicles();
      } else {
        throw new Error("No such document!");
      }
    } catch (error) {
      console.log(error);
    }

    getRentals();
    getVehicles();
  };

  const loginHandler = async (loginEmail, loginPassword, rentalpoint) => {
    setIsLoading(true);
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      await updateDoc(doc(db, "users", user.user.uid), { rentalpoint });
      setLoggedInUser(user);
      setRentalpoint(rentalpoint);
    } catch (error) {
      console.log(error.message);
    }
    setIsLoading(false);
    getRentalpoints();
    getRentals();
    getVehicles();
    getPrices();
  };

  const logoutHandler = async () => {
    setUserPersonalInfo({});
    await signOut(auth);
  };

  const showChangeVehicles = () => {
    setIsChangeVehicleVisible(true);
  };

  const changeVehicle = async (
    rentalId,
    vehiclesToAdd,
    vehiclesToReturn,
    formData,
    canBeCompleted
  ) => {
    const operationTime = new Date();
    try {
      const rentalDoc = await getDoc(doc(db, "rentals", rentalId));
      if (rentalDoc.exists()) {
        const newRentalData = rentalDoc.data().vehicles.map((vehicle) => {
          if (!vehicle.returned) {
            if (vehiclesToReturn.includes(vehicle.vehicleid)) {
              return {
                ...vehicle,
                endDateTime: operationTime.toISOString(),
                returned: true,
              };
            } else {
              return vehicle;
            }
          } else {
            return vehicle;
          }
        });
        vehiclesToAdd.forEach((vehicle) => {
          newRentalData.push({
            vehicleid: vehicle,
            startDateTime: operationTime.toISOString(),
          });
        });
        const payments = rentalDoc.data().payments;
        if (formData.payments[0].amount > 0) {
          payments.push({
            ...formData.payments[0],
            paymentTimestamp: operationTime.toISOString(),
          });
        }
        if (canBeCompleted) {
          await updateDoc(doc(db, "rentals", rentalId), {
            vehicles: newRentalData,
            payments,
            rented: false,
            endRentalpoint: rentalpoint,
            endRentalTime: operationTime.toISOString(),
          });
        } else {
          await updateDoc(doc(db, "rentals", rentalId), {
            vehicles: newRentalData,
            payments,
          });
        }
      } else {
        throw new Error("No such document!");
      }
      const response = await getDocs(vehiclesCollectionRef);
      if (!response) {
        throw new Error("Something went wrong");
      }
      response.docs.forEach((item) => {
        vehiclesToReturn.forEach(async (vehicle) => {
          if (vehicle === item.data().vehicleid) {
            await updateDoc(doc(db, "vehicles", item.id), {
              rented: false,
              rentalpoint,
            });
          }
        });
        vehiclesToAdd.forEach(async (vehicle) => {
          if (vehicle === item.data().vehicleid) {
            await updateDoc(doc(db, "vehicles", item.id), { rented: true });
          }
        });
      });
    } catch (error) {
      console.log(error.message);
    }

    setIsChangeVehicleVisible(false);
    getRentals();
    getVehicles();
  };

  const handleCancel = () => {
    setIsChangeVehicleVisible(false);
  };

  const InfoBar = () => {
    const currentRentalpoint =
      rentalpoints &&
      rentalpoints
        .filter((rentalPoint) => rentalPoint.key === rentalpoint)
        .map((rentalPoint) => rentalPoint.name);
    const FixLink = (
      <a href="https://fix.inkontor.com">
        <ToolTwoTone style={{ fontSize: "2em" }} />
      </a>
    );
    const DashboardLink = userPersonalInfo &&
      userPersonalInfo.role !== "customerAdvisor" && (
        <a href="https://dashboard.inkontor.com">
          <DashboardTwoTone style={{ fontSize: "2em" }} />
        </a>
      );
    return (
      <Row>
        <Row>
          <Col span={24}>
            <Card size="small">
              <Tag color="cyan">Location: {currentRentalpoint}</Tag>
              <Tag color="cyan">
                User: {userPersonalInfo && userPersonalInfo.firstName}
              </Tag>
              {FixLink} {DashboardLink}
            </Card>
          </Col>
        </Row>
      </Row>
    );
  };

  return (
    <Layout>
      <Modal
        destroyOnClose={true}
        title="Change Vehicles"
        visible={isChangeVehicleVisible}
        onCancel={handleCancel}
      >
        <ChangeVehicles
          rentalpoint={rentalpoint}
          changeVehicle={changeVehicle}
          prices={prices}
          vehicles={vehicles}
          rentalData={rentalData}
        />
      </Modal>
      <MainHeader
        rentalpoint={rentalpoint}
        isAuthenticated={loggedInUser}
        onLogout={logoutHandler}
      />
      <Layout style={{ minHeight: "100vh" }}>
        <Layout className="site-layout">
          {loggedInUser && <InfoBar />}
          <Content style={{ margin: "0 16px" }}>
            {!loggedInUser && !isLoading && (
              <Login rentalpoints={rentalpoints} onLogin={loginHandler} />
            )}
            {loggedInUser && !isLoading && !error && (
              <Home
                prices={prices}
                getRentals={getRentals}
                onAddRental={addRentalHandler}
                rentalsList={rentalsList}
                vehicles={vehicles}
                rentalpoint={rentalpoint}
                deleteRental={deleteRentalHandler}
                changeVehicles={changeVehiclesHandler}
                onLogout={logoutHandler}
                loggedInUser={loggedInUser}
              />
            )}
            {isLoading && <p>Loading ...</p>}
            {!isLoading && error && <p>{error}</p>}
          </Content>
          <MainFooter />
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;
