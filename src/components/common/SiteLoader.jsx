
import loaderimg from "../../assets/images/EN_img/loader.svg";


function SiteLoader (props){
 
    return (
        <div
              style={{
                display: "flex",
                flex: 1,
                width: "100%",
                height: "100vh",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src={loaderimg} style={{ height: '100px', width: '100px' }} />
            </div>
      );
  
}

export default SiteLoader;



