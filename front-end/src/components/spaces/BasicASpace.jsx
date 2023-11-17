import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

export default function BasicASpace(prop) {
  const spaceColor = prop.space?.color;
  const showSpaceName = prop.space.name??"";
 return(
    <Card 
    sx={{ cursor:"pointer", position: "relative", borderRadius:4, width:300, minHeight:20, display:"flex", flexDirection:"column", justifyContent:"space-between", color:spaceColor?.text, backgroundColor:spaceColor?.background}}
    onClick={prop.onClick}
    >
      <div
        onClick={prop.onClick}
        style={{
          display:prop.display===true?"block":"none",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize:"50px"
        }}
      >✅</div>
      <CardHeader
        color={spaceColor?.text}
        title={showSpaceName}
        subheader={<p style={{color:spaceColor.text}}>{`${prop.space.tasks?.length??0} tasks`}</p>}
      />
    </Card>
  )
  
}