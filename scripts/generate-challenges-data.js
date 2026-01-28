import fs from 'fs/promises';
import path from 'path';

// Función para parsear el archivo overview.md que tiene métricas consolidadas
async function parseOverviewFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Extraer tabla de progreso general
    const linuxTableMatch = content.match(/\| 🐧 \*\*Linux Challenges\*\* \| (\d+) \| (\d+) ✅ \| (\d+) 🔓 \| (\d+) 🔒 \| \*\*([\d.]+)%\*\*/);
    const dockerTableMatch = content.match(/\| 🐳 \*\*Docker Challenges\*\* \| (\d+) \| (\d+) ✅ \| (\d+) ⏳ \| (\d+) ⏳ \| \*\*([\d.]+)%\*\*/);
    const devopsTableMatch = content.match(/\| ⚙️ \*\*100 Days DevOps\*\* \| (\d+) \| (\d+) ✅ \| (\d+) 🔄 \| (\d+) ⏳ \| \*\*([\d.]+)%\*\*/);
    
    // Extraer métricas totales
    const totalMatch = content.match(/\| \*\*TOTAL\*\* \| \*\*(\d+)\*\* \| \*\*(\d+)\*\* ✅ \| \*\*(\d+)\*\* 🔓 \| \*\*(\d+)\*\* ⏳ \| \*\*([\d.]+)%\*\*/);
    
    // Extraer actividad reciente
    const activityMatches = [...content.matchAll(/\|\s*\d+-\d+-\d+\s*\|\s*[^|]+\|\s*([^|]+)/g)];
    const recentActivity = activityMatches.map(match => match[1].trim()).slice(0, 8);
    
    // Extraer skills del skills matrix
    const skillsSection = content.match(/## 🛠️ Technical Skills Coverage[\s\S]*?##/);
    let skills = [];
    if (skillsSection) {
      const skillMatches = [...skillsSection[0].matchAll(/\|\s*\*\*([^*]+)\*\*\s*\|/g)];
      skills = skillMatches.map(match => match[1].trim());
    }
    
    // Calcular streak basado en actividad reciente
    const uniqueDates = [...new Set(activityMatches.map(match => {
      const dateMatch = match[0].match(/\d+-\d+-\d+/);
      return dateMatch ? dateMatch[0] : '';
    }))].filter(date => date);
    const streak = uniqueDates.length;
    
    return {
      linux: {
        total: linuxTableMatch ? parseInt(linuxTableMatch[1]) : 0,
        completed: linuxTableMatch ? parseInt(linuxTableMatch[2]) : 0,
        inProgress: linuxTableMatch ? parseInt(linuxTableMatch[3]) : 0,
        percentage: linuxTableMatch ? parseFloat(linuxTableMatch[5]) : 0
      },
      docker: {
        total: dockerTableMatch ? parseInt(dockerTableMatch[1]) : 0,
        completed: dockerTableMatch ? parseInt(dockerTableMatch[2]) : 0,
        inProgress: dockerTableMatch ? parseInt(dockerTableMatch[3]) : 0,
        percentage: dockerTableMatch ? parseFloat(dockerTableMatch[5]) : 0
      },
      devops: {
        total: devopsTableMatch ? parseInt(devopsTableMatch[1]) : 0,
        completed: devopsTableMatch ? parseInt(devopsTableMatch[2]) : 0,
        inProgress: devopsTableMatch ? parseInt(devopsTableMatch[3]) : 0,
        percentage: devopsTableMatch ? parseFloat(devopsTableMatch[5]) : 0
      },
      overview: {
        totalChallenges: totalMatch ? parseInt(totalMatch[1]) : 0,
        completed: totalMatch ? parseInt(totalMatch[2]) : 0,
        inProgress: totalMatch ? parseInt(totalMatch[3]) : 0,
        remaining: totalMatch ? parseInt(totalMatch[4]) : 0,
        completionRate: totalMatch ? parseFloat(totalMatch[5]) : 0,
        streak
      },
      recentActivity,
      skills
    };
  } catch (error) {
    console.error(`Error parsing overview file:`, error);
    return null;
  }
}

// Función principal para generar datos de todos los programas
async function generateChallengesData() {
  const progressDir = '../progress';
  const overviewPath = path.join(progressDir, 'overview.md');
  
  try {
    // Parsear el archivo overview.md que tiene las métricas consolidadas
    const data = await parseOverviewFile(overviewPath);
    
    if (!data) {
      throw new Error('Could not parse overview.md');
    }
    
    const challengesData = {
      lastUpdated: new Date().toISOString(),
      overview: {
        totalChallenges: data.overview.totalChallenges,
        completed: data.overview.completed,
        completionRate: data.overview.completionRate,
        streak: data.overview.streak
      },
      programs: {
        linux: {
          total: data.linux.total,
          completed: data.linux.completed,
          percentage: data.linux.percentage,
          recentActivity: data.recentActivity.filter(activity => activity.toLowerCase().includes('linux')),
          skills: data.skills.filter(skill => skill.toLowerCase().includes('user') || skill.toLowerCase().includes('linux')),
          name: 'Linux',
          icon: '🐧',
          color: 'blue'
        },
        docker: {
          total: data.docker.total,
          completed: data.docker.completed,
          percentage: data.docker.percentage,
          recentActivity: data.recentActivity.filter(activity => activity.toLowerCase().includes('docker')),
          skills: data.skills.filter(skill => skill.toLowerCase().includes('docker') || skill.toLowerCase().includes('container')),
          name: 'Docker',
          icon: '🐳',
          color: 'cyan'
        },
        devops: {
          total: data.devops.total,
          completed: data.devops.completed,
          percentage: data.devops.percentage,
          recentActivity: data.recentActivity.filter(activity => activity.toLowerCase().includes('devops')),
          skills: data.skills.filter(skill => skill.toLowerCase().includes('devops') || skill.toLowerCase().includes('script')),
          name: 'DevOps',
          icon: '⚙️',
          color: 'purple'
        }
      },
      recentActivity: data.recentActivity.map((activity, index) => {
        // Determinar el programa basado en el contenido
        if (activity.toLowerCase().includes('docker')) return { program: 'docker', activity, icon: '🐳' };
        if (activity.toLowerCase().includes('linux')) return { program: 'linux', activity, icon: '🐧' };
        return { program: 'devops', activity, icon: '⚙️' };
      }),
      skills: data.skills
    };
    
    // Asegurar que el directorio de datos exista
    await fs.mkdir('src/data', { recursive: true });
    
    // Escribir archivo JSON
    await fs.writeFile(
      'src/data/challenges.json',
      JSON.stringify(challengesData, null, 2)
    );
    
    console.log('✅ Challenges data generated successfully!');
    console.log(`📊 Total: ${data.overview.completed}/${data.overview.totalChallenges} (${data.overview.completionRate}%)`);
    console.log(`🔥 Current streak: ${data.overview.streak} days`);
    console.log(`🐧 Linux: ${data.linux.completed}/${data.linux.total} (${data.linux.percentage}%)`);
    console.log(`🐳 Docker: ${data.docker.completed}/${data.docker.total} (${data.docker.percentage}%)`);
    console.log(`⚙️ DevOps: ${data.devops.completed}/${data.devops.total} (${data.devops.percentage}%)`);
    
    return challengesData;
    
  } catch (error) {
    console.error('❌ Error generating challenges data:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  generateChallengesData();
}

export { generateChallengesData };