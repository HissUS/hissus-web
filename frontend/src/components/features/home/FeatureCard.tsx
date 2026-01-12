import { Card } from '../../ui/card/Card';
import DoorImg from '@/assets/images/double_handle/DH_screendoor.jpg'
import WindowsImg from '@/assets/images/windows/windows.jpg'
import '../../../styles/feature-card.css';

// // data types
// Type = {
//   img: string;
//   title: string;
//   content: string;
// }

// // parameters 
// useFeatureCardProps{
//   data: Type
// }

// // database info
// useFeatureCard(props: useFeatureCardProps) {
//   const data: Type[]=[
//     {
//       img: 'https...';
//       title: "window";
//       content: "new window";
//     },
//     {
//       img: 'https...';
//       title: "door";
//       content: "new door";
//     },
//   ];

//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   return (
//     data,
//    isOpen,
//    setIsOpen,

//   )
// }

// // FeatureCard component
// export featureCardProps{
//   data: Type
// }
// export default function FeatureCard(props:featureCardProps) {
//   const {
//     img, 
//     title, 
//     content,
//   } = props;
    
//   return (
//     <Card>
//       <Grid> img</Grid>
//       <Grid> title</Grid>
//       <Grid> content</Grid>
//     </Card>
//   )
//   }


//   // Parent Component
//   HeroProps
//   export default Hero(props: HeroProps){
//     const featureCardRequest = useFeatureCard();

//     return (
//       <Columns>
//         featureCardRequest.data.map((item)=>{
//           <Column>
//             <FeatureCard data={item}/>
//           </Column>
//         })
//         </Columns>
//     );
//   }

export default function FeatureCard() {
  return (
    <div className="relative w-full">
      {/* Wave top separator */}
      <div className="feature-section-wave-top">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path 
            fill="#ffffff" 
            fillOpacity="1" 
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>
      
      {/* Main section with gradient and patterns */}
      <div className="feature-section-main">
        {/* Animated geometric patterns */}
        <div className="animated-patterns-container">
          <div className="pattern-circle-large"></div>
          <div className="pattern-square-medium"></div>
          <div className="pattern-circle-xlarge"></div>
          <div className="pattern-rounded-square"></div>
        </div>
        
        {/* Floating particles */}
        <div className="particle-small particle-1"></div>
        <div className="particle-small particle-2"></div>
        <div className="particle-small particle-3"></div>
        
        <div className="max-w-7xl w-full relative z-10">
          {/* Section Header with gradient text */}
          <div className="feature-section-header">
            <div className="inline-block mb-6">
              <span className="gradient-subheading">Premium Solutions</span>
            </div>
            <h2 className="gradient-heading">
              Elevate Your Space
            </h2>
            <p className="gradient-subtitle feature-section-subtitle">
              Transform your home with innovative retractable screen technology
            </p>
          </div>

          {/* Cards with staggered layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 feature-section-cards-grid items-stretch">
            <div className="animate-slide-in-left lg:mt-8 flex">
              <Card
                title="Door Screens"
                description="Our retractable door screens are custom-designed for single doors, double doors, and sliding patio doors, allowing fresh air and natural light to flow in while maintaining a clean, refined appearance and strong curb appeal."
                buttonText="Learn More"
                buttonLink="/products/door-screens"
                imageSrc = {DoorImg}
              />
            </div>

            <div className="animate-slide-in-right lg:-mt-8 flex">
              <Card
                title="Window Screens"
                description="Whatever your window type, our custom window screens are designed to deliver smooth airflow and dependable insect protection—bringing fresh air in while keeping pests out."
                buttonText="Learn More"
                buttonLink="/products/window-screens"
                imageSrc = {WindowsImg}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave bottom separator */}
      <div className="feature-section-wave-bottom">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path 
            fill="#fffffff0" 
            // fillOpacity="1" 
            d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,69.3C960,64,1056,64,1152,69.3C1248,75,1344,85,1392,90.7L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}

