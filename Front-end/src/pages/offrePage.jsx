import { useEffect, useState } from "react";

import Annonce from "../components/Annonce";

function OffrePage() {

  const [offres, setOffres] = useState([]);

  useEffect(() => {

   fetch("http://localhost:3000/api/annonces")

      .then((res) => res.json())

      .then((data) => {

        console.log(data);

        setOffres(data);
      })

      .catch((error) => {
        console.error(error);
      });

  }, []);

  return (
    <div>

      {offres.map((offre) => (

        <Annonce
          key={offre.id}
          offre={offre}
        />

      ))}

    </div>
  );
}

export default OffrePage;